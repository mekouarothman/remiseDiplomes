const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Configurer CORS pour autoriser toutes les origines
app.use(cors());
const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";

app.post('/send-email', async (req, res) => {
  const { etudiant, person1, person2, person3, person4 } = req.body;

  try {
    console.log('Received request with data:', req.body);

    const guests = [person1, person2, person3, person4].filter(person => person);
    const qrData = guests.map(person => `${person.nom}, ${person.prenom}, ${person.cin}`).join('\n');
    const qrDataURL = await QRCode.toDataURL(qrData);
    console.log('Generated QR Code Data URL');

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Listes des invités', 105, 155, { align: 'center' });

    doc.setFontSize(10);
    const positions = [
      { x: 50, y: 170 },
      { x: 120, y: 170 },
      { x: 50, y: 210 },
      { x: 120, y: 210 },
    ];

    guests.forEach((guest, index) => {
      const pos = positions[index];
      if (guest) {
        doc.text(`Nom: ${guest.nom}`, pos.x, pos.y);
        doc.text(`Prénom: ${guest.prenom}`, pos.x, pos.y + 5);
        doc.text(`CIN: ${guest.cin}`, pos.x, pos.y + 10);
        doc.text(`Sexe: ${guest.sexe}`, pos.x, pos.y + 15);
        doc.text(`Date de Naissance: ${guest.dateNaissance}`, pos.x, pos.y + 20);
        doc.text(`Lieu de Naissance: ${guest.lieuNaissance}`, pos.x, pos.y + 25);
      }
    });

    doc.addImage(qrDataURL, 'PNG', 10, 240, 50, 50);

    const pageWidth = doc.internal.pageSize.width;
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const imgWidth = 50;
    const imgHeight = 50;
    const x = (pageWidth - imgWidth) / 2;
    const y = 0;
    doc.addImage(logoBase64, "PNG", x, y, imgWidth, imgHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Ecole Supérieure d'Ingénierie en Sciences Appliquées", 50, 50);
    doc.setFontSize(10);
    doc.text(`Fait à Fès, le : ${date}`, 150, 20);

    const text1 = `Cette attestation est destinée aux invités de l'étudiant${etudiant.sexe === "F" ? "e" : ""} ${etudiant.prenom} ${etudiant.nom}, né${etudiant.sexe === "F" ? "e" : ""} le ${etudiant.dateNaissance} à ${etudiant.lieuNaissance}.\n\nCette attestation sera exigée à l'entrée afin de vérifier que les invités sont bien les personnes conviées par le diplômé de l'année scolaire 2022-2023.\n\nLes invités qui se présenteront sans cette attestation ne pourront pas accéder à la cérémonie.\n\nVeuillez noter que les deux premières personnes mentionnées sont confirmées comme invitées, tandis que les deux dernières seront invitées sous réserve de la disponibilité des places. Vous recevrez un message d'ici le 5 juin pour confirmer la possibilité d'accueil de votre troisième et quatrième invité.\n\nPour toute autre demande, veuillez contacter le service administratif de l'ESISA.`;

    const splitText1 = doc.splitTextToSize(text1, pageWidth - 40);
    doc.text(splitText1, 20, 75);

    doc.setFont("helvetica");
    doc.text("Attesté par", 150, 265);
    doc.setFont("helvetica", "normal");
    doc.text("L'équipe administrative de l'ESISA", 130, 275);

    const pdfBuffer = doc.output('arraybuffer');
    console.log('Generated PDF buffer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptionsESISA = {
      from: 'info@esisa.ac.ma',
      to: 'info@esisa.ac.ma',
      subject: 'Invitation à la cérémonie de remise de diplômes',
      text: 'Veuillez trouver ci-joint l\'invitation à la cérémonie de remise de diplômes.',
      attachments: [
        {
          filename: 'invitation_diplomes.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };

    const mailOptionsStudent = {
      from: 'info@esisa.ac.ma',
      to: etudiant.email,
      subject: 'Invitation à la cérémonie de remise de diplômes',
      text: `Bonjour ${etudiant.prenom},\n\nVeuillez trouver ci-joint l'invitation à la cérémonie de remise de diplômes.\n\nCordialement,\nL'équipe administrative de l'ESISA.`,
      attachments: [
        {
          filename: 'invitation_diplomes.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('Sending email to ESISA...');
    transporter.sendMail(mailOptionsESISA, (error, info) => {
      if (error) {
        console.error('Error sending email to ESISA:', error);
        return res.status(500).send(error.toString());
      }

      console.log('Sending email to Student...');
      transporter.sendMail(mailOptionsStudent, (error, info) => {
        if (error) {
          console.error('Error sending email to Student:', error);
          return res.status(500).send(error.toString());
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBuffer));
        console.log('Email sent successfully and PDF sent as response');
      });
    });

  } catch (error) {
    console.error('Error generating QR code or PDF:', error);
    res.status(500).send('Server error');
  }
});
