import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  LinearProgress,MenuItem
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./diplome.css";
import logo from "../../images/logo.png"; // Assurez-vous que le chemin est correct

const Diplomes = () => {
  const [etudiant, setEtudiant] = useState({
    nom: "",
    prenom: "",
    cin: "",
    sexe: "",
    dateNaissance: "",
    lieuNaissance: "",
    email: "",
  });
  const [persons, setPersons] = useState([
    {
      nom: "",
      prenom: "",
      cin: "",
      sexe: "",
      dateNaissance: "",
      lieuNaissance: "",
    },
    {
      nom: "",
      prenom: "",
      cin: "",
      sexe: "",
      dateNaissance: "",
      lieuNaissance: "",
    },
    {
      nom: "",
      prenom: "",
      cin: "",
      sexe: "",
      dateNaissance: "",
      lieuNaissance: "",
    },
    {
      nom: "",
      prenom: "",
      cin: "",
      sexe: "",
      dateNaissance: "",
      lieuNaissance: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetForm = () => {
    setEtudiant({
      nom: "",
      prenom: "",
      cin: "",
      sexe: "",
      dateNaissance: "",
      lieuNaissance: "",
      email: "",
    });
    setPersons([
      {
        nom: "",
        prenom: "",
        cin: "",
        sexe: "",
        dateNaissance: "",
        lieuNaissance: "",
      },
      {
        nom: "",
        prenom: "",
        cin: "",
        sexe: "",
        dateNaissance: "",
        lieuNaissance: "",
      },
      {
        nom: "",
        prenom: "",
        cin: "",
        sexe: "",
        dateNaissance: "",
        lieuNaissance: "",
      },
      {
        nom: "",
        prenom: "",
        cin: "",
        sexe: "",
        dateNaissance: "",
        lieuNaissance: "",
      },
    ]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    const sanitizePerson = (person) => {
      for (const key in person) {
        if (person[key] === "") {
          person[key] = "NaN";
        }
      }
      return person;
    };

    const sanitizedPersons = persons.map((person) =>
      sanitizePerson({ ...person })
    );

    try {
      const response = await axios.post(
        "http://localhost:3001/send-email",
        {
          etudiant,
          person1: persons[0],
          person2: sanitizedPersons[1],
          person3: sanitizedPersons[2],
          person4: sanitizedPersons[3],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Email envoyé avec succès");
        resetForm(); // Réinitialisation du formulaire après succès
      } else {
        toast.error("Échec de l'envoi de l'email");
      }

      // Envoi de l'e-mail à l'étudiant
      try {
        const studentEmailResponse = await axios.post(
          "http://localhost:3001/send-email",
          { etudiant, persons: sanitizedPersons },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (studentEmailResponse.status !== 200) {
          console.log("Échec de l'envoi de l'e-mail à l'étudiant");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail à l'étudiant :", error);
        toast.error(
          "Réessayez plus tard pour l'envoi de l'e-mail à l'étudiant"
        );
      }
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Réessayez plus tard :p ");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Formulaire de Remise des Diplômes
        </Typography>
        <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Inputs pour l'étudiant */}
            <Typography variant="h6">Informations de l'étudiant</Typography>
            <TextField
              label="Nom"
              value={etudiant.nom}
              onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })}
              required
            />
            <TextField
              label="Prénom"
              value={etudiant.prenom}
              onChange={(e) =>
                setEtudiant({ ...etudiant, prenom: e.target.value })
              }
              required
            />
            <TextField
              label="CIN"
              value={etudiant.cin}
              onChange={(e) => setEtudiant({ ...etudiant, cin: e.target.value })}
              required
            />
            <TextField
              select
              label="Sexe"
              value={etudiant.sexe}
              onChange={(e) => setEtudiant({ ...etudiant, sexe: e.target.value })}
              required
            >
              <MenuItem value="M">Masculin</MenuItem>
              <MenuItem value="F">Féminin</MenuItem>
            </TextField>
            <TextField
              label="Date de Naissance"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={etudiant.dateNaissance}
              onChange={(e) =>
                setEtudiant({ ...etudiant, dateNaissance: e.target.value })
              }
              required
            />
            <TextField
              label="Lieu de Naissance"
              value={etudiant.lieuNaissance}
              onChange={(e) =>
                setEtudiant({ ...etudiant, lieuNaissance: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              type="email"
              value={etudiant.email}
              onChange={(e) =>
                setEtudiant({ ...etudiant, email: e.target.value })
              }
              required
            />
            {/* Inputs pour les invités */}
            <Typography variant="h6">Informations des invités</Typography>
            {persons.map((person, index) => (
              <Box key={index} sx={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
                <Typography variant="subtitle1">Invité {index + 1}</Typography>
                <TextField
                  label="Nom"
                  value={person.nom}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], nom: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                />
                <TextField
                  label="Prénom"
                  value={person.prenom}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], prenom: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                />
                <TextField
                  label="CIN"
                  value={person.cin}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], cin: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                />
                <TextField
                  select
                  label="Sexe"
                  value={person.sexe}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], sexe: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                >
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </TextField>
                <TextField
                  label="Date de Naissance"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={person.dateNaissance}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], dateNaissance: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                />
                <TextField
                  label="Lieu de Naissance"
                  value={person.lieuNaissance}
                  onChange={(e) => {
                    const updatedPersons = [...persons];
                    updatedPersons[index] = { ...updatedPersons[index], lieuNaissance: e.target.value };
                    setPersons(updatedPersons);
                  }}
                  required
                />
              </Box>
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 1 }}
             
              >
              Envoyer
            </Button>
            {loading && <LinearProgress variant="determinate" value={progress} />}
          </Box>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Diplomes;
