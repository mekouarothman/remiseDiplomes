import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography, MenuItem, LinearProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./diplome.css";
import logo from "../../images/logo.png"; // Assurez-vous que le chemin est correct


const Diplomes = () => {
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
  const [persons, setPersons] = useState([
    { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
    { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
    { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
    { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetForm = () => {
    setEtudiant({ nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' });
    setPersons([
      { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
      { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
      { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
      { nom: '', prenom: '', cin: '', sexe: '', dateNaissance: '', lieuNaissance: '' },
    ]);
  };

 
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
  
    const sanitizePerson = (person) => {
      for (const key in person) {
        if (person[key] === '') {
          person[key] = 'NaN';
        }
      }
      return person;
    };
  
    const sanitizedPersons = persons.map((person) => sanitizePerson({ ...person }));
  
    try {
      const response = await fetch(
        'https://remise-diplomes-back.vercel.app/send-email', // URL de votre backend déployé
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ etudiant, person1: persons[0], person2: sanitizedPersons[1], person3: sanitizedPersons[2], person4: sanitizedPersons[3] }),
           credentials: 'include' 
        }
      );
  

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
        resetForm(); // Réinitialisation du formulaire après succès
      } else {
        toast.error('Échec de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur :', error);
      toast.error("Revenez demain :D ");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };
  
  
  return (
    <Container maxWidth="sm" className="diplome-container">
      <ToastContainer />
  
      <img src={logo} alt="Logo" className="logo" />
  
      <Typography variant="h5" align="center" gutterBottom>
        Remise de diplômes
      </Typography>
  
      <form onSubmit={handleFormSubmit}>
        {/* Champs pour l'étudiant */}
        <Typography style={{ padding: '2rem' }} variant="h6" gutterBottom>
          Informations sur l'étudiant
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <TextField
            required
            fullWidth
            label="Nom"
            variant="outlined"
            value={etudiant.nom}
            onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })}
          />
          <TextField
            required
            fullWidth
            label="Prénom"
            variant="outlined"
            value={etudiant.prenom}
            onChange={(e) => setEtudiant({ ...etudiant, prenom: e.target.value })}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <TextField
            required
            fullWidth
            label="CIN"
            variant="outlined"
            value={etudiant.cin}
            onChange={(e) => setEtudiant({ ...etudiant, cin: e.target.value })}
          />
          <TextField
            required
            select
            fullWidth
            label="Sexe"
            variant="outlined"
            value={etudiant.sexe}
            onChange={(e) => setEtudiant({ ...etudiant, sexe: e.target.value })}
          >
            <MenuItem value="M">Masculin</MenuItem>
            <MenuItem value="F">Féminin</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <TextField
            required
            fullWidth
            label="Date de Naissance"
            variant="outlined"
            type="date"
            value={etudiant.dateNaissance}
            onChange={(e) =>
              setEtudiant({ ...etudiant, dateNaissance: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            fullWidth
            label="Lieu de Naissance"
            variant="outlined"
            value={etudiant.lieuNaissance}
            onChange={(e) =>
              setEtudiant({ ...etudiant, lieuNaissance: e.target.value })
            }
          />
        </Box>
  
        {/* Champs pour les invités */}
        <Typography style={{ padding: '2rem' }} variant="h6" gutterBottom>
          Informations sur les invités
        </Typography>
  
        {persons.map((person, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
            <h2 className="h2">{`Invité ${index + 1}`}</h2>
            <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <TextField
                
                fullWidth
                label={`Nom de l'invité ${index + 1}`}
                variant="outlined"
                value={person.nom}
                onChange={(e) =>
                  setPersons(prevPersons => {
                    const updatedPersons = [...prevPersons];
                    updatedPersons[index] = { ...updatedPersons[index], nom: e.target.value };
                    return updatedPersons;
                  })
                }
              />
              <TextField
                
                fullWidth
                label={`Prénom de l'invité ${index + 1}`}
                variant="outlined"
                value={person.prenom}
                onChange={(e) =>
                  setPersons(prevPersons => {
                    const updatedPersons = [...prevPersons];
                    updatedPersons[index] = { ...updatedPersons[index], prenom: e.target.value };
                    return updatedPersons;
                  })
                }
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <TextField
                
                fullWidth
                label={`CIN de l'invité ${index + 1}`}
                variant="outlined"
                value={person.cin}
                onChange={(e) =>
                  setPersons(prevPersons => {
                    const updatedPersons = [...prevPersons];
                    updatedPersons[index] = { ...updatedPersons[index], cin: e.target.value };
                    return updatedPersons;
                  })
                }
              />
              <TextField
                
                fullWidth
                label={`Date de Naissance de l'invité ${index + 1}`}
                variant="outlined"
                type="date"
                value={person.dateNaissance}
                onChange={(e) =>
                  setPersons(prevPersons => {
                    const updatedPersons = [...prevPersons];
                    updatedPersons[index] = { ...updatedPersons[index], dateNaissance: e.target.value };
                    return updatedPersons;
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <TextField
                
                fullWidth
                label={`Lieu de Naissance de l'invité ${index + 1}`}
                variant="outlined"
                value={person.lieuNaissance}
                onChange={(e) =>
                  setPersons(prevPersons => {
                    const updatedPersons = [...prevPersons];
                    updatedPersons[index] = { ...updatedPersons[index], lieuNaissance: e.target.value };
                    return updatedPersons;
                  })
                }
              />

<TextField
            select
            fullWidth
            label="Sexe"
            variant="outlined"
            value={person.sexe}
            onChange={(e) =>
              setPersons(prevPersons => {
                const updatedPersons = [...prevPersons];
                updatedPersons[index] = { ...updatedPersons[index], sexe: e.target.value };
                return updatedPersons;
              })
            }
          >
            <MenuItem value="M">Masculin</MenuItem>
            <MenuItem value="F">Féminin</MenuItem>
          </TextField>
            </Box>
          </Box>
        ))}
  
        <Button
          style={{ marginTop: '2rem' }}
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ marginBottom: '20px' }}
        >
          {loading ? <LinearProgress sx={{ width: '100%' }} /> : "Télécharger l'invitation"}
        </Button>
      </form>
    </Container>
  );
}

export default Diplomes