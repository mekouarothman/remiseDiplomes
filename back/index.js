const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path'); // Import the path library
const fs = require('fs');
require('dotenv').config(); // Load dotenv to read .env file


const app = express();
const port = process.env.PORT ;

app.use(bodyParser.json());
// app.use(cors);

// Configure CORS
const corsOptions = {
    origin: 'https://esisa-remisededeiplomes.vercel.app',
    credentials: true,
  };
  app.use(cors(corsOptions));
  



// Import the logo
const logoPath = path.join(__dirname, './images/logo.png');
const logoBuffer = fs.readFileSync(logoPath);
const logoBase64 = logoBuffer.toString('base64');

app.post('/send-email', async (req, res) => {
    const { etudiant, person1, person2, person3, person4 } = req.body;

    try {
        // Generate QR code
        const qrData = `${person1.nom}, ${person1.prenom}, ${person1.cin}\n${person2.nom}, ${person2.prenom}, ${person2.cin}\n${person3.nom}, ${person3.prenom}, ${person3.cin}\n${person4.nom}, ${person4.prenom}, ${person4.cin}`;
        const qrDataURL = await QRCode.toDataURL(qrData);

        // Generate PDF
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Listes des invités', 105, 155, { align: 'center' });

        doc.setFontSize(10);
        // Guest information
        const guests = [person1, person2, person3, person4];
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

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
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

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            // Send the PDF as a response to allow download
            res.setHeader('Content-Type', 'application/pdf');
            res.send(Buffer.from(pdfBuffer));
        });

    } catch (error) {
        console.error('Error generating QR code or PDF:', error);
        res.status(500).send('Server error');
    }
});
app.get('/', (req, res) => {
    res.send('Bonjour, vous êtes sur la page d\'accueil !');
  });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});