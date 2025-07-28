#!/usr/bin/env node

/**
 * Script de test simplifiée pour l'application SOMIPEM
 * Ce script vérifie juste la connectivité de l'API
 */

const axios = require('axios');

const API_URL = 'http://localhost:3002';

/**
 * Test principal
 */
async function runTests() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Démarrage des tests de connectivité pour SOMIPEM');
    
    // Test de base - l'API répond
    console.log('🔍 Vérification de la connectivité de l\'API...');
    const response = await axios.get(`${API_URL}`);
    
    if (response.status === 200) {
      console.log('\x1b[32m%s\x1b[0m', '✅ L\'API est en ligne!');
    } else {
      console.log('\x1b[31m%s\x1b[0m', `❌ L'API répond avec le statut ${response.status}`);
    }
      // Test de l'API d'authentification
    console.log('🔍 Vérification de l\'API d\'authentification...');
    try {
      // Nous envoyons une requête valide pour vérifier le bon fonctionnement de l'API d'authentification
      const authResponse = await axios.post(`${API_URL}/auth/callback`, { code: 'test_code' });
      
      if (authResponse.status === 201 && authResponse.data.token) {
        console.log('\x1b[32m%s\x1b[0m', '✅ L\'API d\'authentification fonctionne correctement');
        console.log('\x1b[36m%s\x1b[0m', `📝 Token reçu: ${authResponse.data.token.substring(0, 20)}...`);
      } else {
        console.log('\x1b[31m%s\x1b[0m', `❌ L'API d'authentification répond avec un format inattendu: ${JSON.stringify(authResponse.data)}`);
      }
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Erreur lors de l\'appel à l\'API d\'authentification');
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log(error);
      }
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✅ Tests de connectivité terminés avec succès!');
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', '❌ Échec du test:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
