import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography, MenuItem, LinearProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./diplome.css";
import logo from "../../images/logo.png"; // Assurez-vous que le chemin est correct

const Diplomes = () => {
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [person1, setPerson1] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [person2, setPerson2] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [person3, setPerson3] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [person4, setPerson4] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetForm = () => {
    setEtudiant({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
    setPerson1({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
    setPerson2({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
    setPerson3({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
    setPerson4({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    try {
      const response = await fetch('https://remise-diplomes-back.vercel.app/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ etudiant, person1, person2, person3, person4 }),
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          setProgress(Math.round((current / total) * 100));
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invitation_diplomes.pdf';
        document.body.appendChild(a); // Ajout à la fin du corps du document
        a.click();
        a.remove(); // Suppression après le téléchargement
        toast.success('Email envoyé et PDF téléchargé avec succès');
        resetForm();  // Réinitialisation du formulaire après succès
      } else {
        toast.error('Échec de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur :', error);
      toast.error('Une erreur s\'est produite');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="centered-content">

      <img className="logo" src={logo}
      />
        <h2 className="title">Invitation à la cérémonie de remise de diplômes</h2>
      </div>
      <div className="info-contact-container">
      <div className="response-time">
  Nous vous invitons à remplir ce formulaire avec les informations complètes des quatre personnes que vous souhaitez inviter à la remise des diplômes. Les deux premières personnes seront confirmées comme invitées, tandis que les deux dernières seront invitées sous réserve de la disponibilité des places. Cela nous aidera à préparer les documents nécessaires pour cette occasion spéciale. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider et vous accompagner tout au long du processus.
</div>

      </div>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" gutterBottom>
              Informations de l'étudiant(e)
            </Typography>
            <TextField label="Nom" variant="outlined" margin="normal" fullWidth value={etudiant.nom} onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })} required />
            <TextField label="Prénom" variant="outlined" margin="normal" fullWidth value={etudiant.prenom} onChange={(e) => setEtudiant({ ...etudiant, prenom: e.target.value })} required />
            <TextField label="CIN" variant="outlined" margin="normal" fullWidth value={etudiant.cin} onChange={(e) => setEtudiant({ ...etudiant, cin: e.target.value })} required />
            <TextField label="Date de naissance" variant="outlined" margin="normal" fullWidth value={etudiant.dateNaissance} onChange={(e) => setEtudiant({ ...etudiant, dateNaissance: e.target.value })} required />
            <TextField label="Lieu de naissance" variant="outlined" margin="normal" fullWidth value={etudiant.lieuNaissance} onChange={(e) => setEtudiant({ ...etudiant, lieuNaissance: e.target.value })} required />
            <TextField select label="Sexe" variant="outlined" margin="normal" fullWidth value={etudiant.sexe} onChange={(e) => setEtudiant({ ...etudiant, sexe: e.target.value })} required>
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>

            <Typography variant="h6" gutterBottom>
              Invité 1
            </Typography>
            <TextField label="Nom" variant="outlined" margin="normal" fullWidth value={person1.nom} onChange={(e) => setPerson1({ ...person1, nom: e.target.value })} required />
            <TextField label="Prénom" variant="outlined" margin="normal" fullWidth value={person1.prenom} onChange={(e) => setPerson1({ ...person1, prenom: e.target.value })} required />
            <TextField label="CIN" variant="outlined" margin="normal" fullWidth value={person1.cin} onChange={(e) => setPerson1({ ...person1, cin: e.target.value })} required />
            <TextField label="Date de naissance" variant="outlined" margin="normal" fullWidth value={person1.dateNaissance} onChange={(e) => setPerson1({ ...person1, dateNaissance: e.target.value })} required />
            <TextField label="Lieu de naissance" variant="outlined" margin="normal" fullWidth value={person1.lieuNaissance} onChange={(e) => setPerson1({ ...person1, lieuNaissance: e.target.value })} required />
            <TextField select label="Sexe" variant="outlined" margin="normal" fullWidth value={person1.sexe} onChange={(e) => setPerson1({ ...person1, sexe: e.target.value })} required>
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>

            <Typography variant="h6" gutterBottom>
              Invité 2
            </Typography>
            <TextField label="Nom" variant="outlined" margin="normal" fullWidth value={person2.nom} onChange={(e) => setPerson2({ ...person2, nom: e.target.value })}  />
            <TextField label="Prénom" variant="outlined" margin="normal" fullWidth value={person2.prenom} onChange={(e) => setPerson2({ ...person2, prenom: e.target.value })}  />
            <TextField label="CIN" variant="outlined" margin="normal" fullWidth value={person2.cin} onChange={(e) => setPerson2({ ...person2, cin: e.target.value })}  />
            <TextField label="Date de naissance" variant="outlined" margin="normal" fullWidth value={person2.dateNaissance} onChange={(e) => setPerson2({ ...person2, dateNaissance: e.target.value })}  />
            <TextField label="Lieu de naissance" variant="outlined" margin="normal" fullWidth value={person2.lieuNaissance} onChange={(e) => setPerson2({ ...person2, lieuNaissance: e.target.value })}  />
            <TextField select label="Sexe" variant="outlined" margin="normal" fullWidth value={person2.sexe} onChange={(e) => setPerson2({ ...person2, sexe: e.target.value })} >
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>

            <Typography variant="h6" gutterBottom>
              Invité 3
            </Typography>
            <TextField label="Nom" variant="outlined" margin="normal" fullWidth value={person3.nom} onChange={(e) => setPerson3({ ...person3, nom: e.target.value })}  />
            <TextField label="Prénom" variant="outlined" margin="normal" fullWidth value={person3.prenom} onChange={(e) => setPerson3({ ...person3, prenom: e.target.value })}  />
            <TextField label="CIN" variant="outlined" margin="normal" fullWidth value={person3.cin} onChange={(e) => setPerson3({ ...person3, cin: e.target.value })}  />
            <TextField label="Date de naissance" variant="outlined" margin="normal" fullWidth value={person3.dateNaissance} onChange={(e) => setPerson3({ ...person3, dateNaissance: e.target.value })}  />
            <TextField label="Lieu de naissance" variant="outlined" margin="normal" fullWidth value={person3.lieuNaissance} onChange={(e) => setPerson3({ ...person3, lieuNaissance: e.target.value })}  />
            <TextField select label="Sexe" variant="outlined" margin="normal" fullWidth value={person3.sexe} onChange={(e) => setPerson3({ ...person3, sexe: e.target.value })} >
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>

            <Typography variant="h6" gutterBottom>
              Invité 4
            </Typography>
            <TextField label="Nom" variant="outlined" margin="normal" fullWidth value={person4.nom} onChange={(e) => setPerson4({ ...person4, nom: e.target.value })}  />
            <TextField label="Prénom" variant="outlined" margin="normal" fullWidth value={person4.prenom} onChange={(e) => setPerson4({ ...person4, prenom: e.target.value })}  />
            <TextField label="CIN" variant="outlined" margin="normal" fullWidth value={person4.cin} onChange={(e) => setPerson4({ ...person4, cin: e.target.value })}  />
            <TextField label="Date de naissance" variant="outlined" margin="normal" fullWidth value={person4.dateNaissance} onChange={(e) => setPerson4({ ...person4, dateNaissance: e.target.value })}  />
            <TextField label="Lieu de naissance" variant="outlined" margin="normal" fullWidth value={person4.lieuNaissance} onChange={(e) => setPerson4({ ...person4, lieuNaissance: e.target.value })}  />
            <TextField select label="Sexe" variant="outlined" margin="normal" fullWidth value={person4.sexe} onChange={(e) => setPerson4({ ...person4, sexe: e.target.value })} >
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
            </Button>
            {loading && <LinearProgress variant="determinate" value={progress} />}
          </form>
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Diplomes;