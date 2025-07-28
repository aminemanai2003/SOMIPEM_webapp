#!/usr/bin/env node

/**
 * Script de test end-to-end pour l'application SOMIPEM
 * Ce script vérifie toutes les fonctionnalités principales de l'application.
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const API_URL = 'http://localhost:3002';
const prisma = new PrismaClient();

// Stockage temporaire pour les données de test
let adminToken;
let workerToken;
let reclamationId;

// Fonction utilitaire pour attendre entre les étapes
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Test principal
 */
async function runTests() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Démarrage des tests end-to-end pour SOMIPEM');
    
    // 1. Nettoyer la base de données pour les tests
    await cleanupDatabase();
    
    // 2. Créer des utilisateurs de test
    await createTestUsers();
    
    // 3. Tester l'authentification
    await testAuthentication();
    
    // 4. Tester la création de réclamation
    await testCreateReclamation();
    
    // 5. Tester la récupération des réclamations
    await testGetReclamations();
    
    // 6. Tester la mise à jour du statut d'une réclamation
    await testUpdateReclamationStatus();
    
    // 7. Tester les statistiques
    await testReclamationStats();
    
    console.log('\x1b[32m%s\x1b[0m', '✅ Tous les tests ont réussi!');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Échec du test: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Nettoie la base de données pour les tests
 */
async function cleanupDatabase() {
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.reclamation.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Base de données nettoyée');
}

/**
 * Crée des utilisateurs de test
 */
async function createTestUsers() {
  console.log('👥 Création des utilisateurs de test...');
  
  // Créer un administrateur
  const admin = await prisma.user.create({
    data: {
      email: 'admin@somipem.com',
      name: 'Administrateur Test',
      role: 'ADMIN',
    },
  });
  
  // Créer un employé
  const worker = await prisma.user.create({
    data: {
      email: 'worker@somipem.com',
      name: 'Employé Test',
      role: 'WORKER',
    },
  });
  
  console.log('✅ Utilisateurs créés');
}

/**
 * Teste l'authentification
 */
async function testAuthentication() {
  console.log('🔑 Test de l\'authentification...');
  
  // Simuler l'authentification pour l'administrateur
  const adminAuthResponse = await axios.post(`${API_URL}/auth/callback`, {
    code: 'admin_test_code',
    email: 'admin@somipem.com',
  }).catch(err => {
    console.error('Erreur d\'authentification admin:', err.response?.data || err.message);
    throw new Error('Échec de l\'authentification admin');
  });
  
  adminToken = adminAuthResponse.data.token;
  console.log('✅ Token admin obtenu');
  
  // Simuler l'authentification pour l'employé
  const workerAuthResponse = await axios.post(`${API_URL}/auth/callback`, {
    code: 'worker_test_code',
    email: 'worker@somipem.com',
  }).catch(err => {
    console.error('Erreur d\'authentification employé:', err.response?.data || err.message);
    throw new Error('Échec de l\'authentification employé');
  });
  
  workerToken = workerAuthResponse.data.token;
  console.log('✅ Token employé obtenu');
}

/**
 * Teste la création de réclamation
 */
async function testCreateReclamation() {
  console.log('📝 Test de création de réclamation...');
  
  const formData = new FormData();
  formData.append('title', 'Réclamation test');
  formData.append('description', 'Ceci est une réclamation de test pour vérifier le fonctionnement de l\'application');
  
  // Créer avec le token employé
  const response = await axios.post(`${API_URL}/reclamations`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${workerToken}`,
    },
  }).catch(err => {
    console.error('Erreur de création de réclamation:', err.response?.data || err.message);
    throw new Error('Échec de la création de réclamation');
  });
  
  reclamationId = response.data.id;
  console.log(`✅ Réclamation créée avec l'ID: ${reclamationId}`);
}

/**
 * Teste la récupération des réclamations
 */
async function testGetReclamations() {
  console.log('📋 Test de récupération des réclamations...');
  
  // Récupérer les réclamations de l'employé
  const workerReclamations = await axios.get(`${API_URL}/reclamations/me`, {
    headers: {
      'Authorization': `Bearer ${workerToken}`,
    },
  }).catch(err => {
    console.error('Erreur de récupération des réclamations employé:', err.response?.data || err.message);
    throw new Error('Échec de la récupération des réclamations employé');
  });
  
  if (workerReclamations.data.length !== 1) {
    throw new Error(`L'employé devrait avoir 1 réclamation, mais en a ${workerReclamations.data.length}`);
  }
  
  console.log('✅ Réclamations de l\'employé récupérées');
  
  // Récupérer toutes les réclamations en tant qu'administrateur
  const allReclamations = await axios.get(`${API_URL}/admin/reclamations`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  }).catch(err => {
    console.error('Erreur de récupération de toutes les réclamations:', err.response?.data || err.message);
    throw new Error('Échec de la récupération de toutes les réclamations');
  });
  
  if (allReclamations.data.length !== 1) {
    throw new Error(`L'administrateur devrait voir 1 réclamation, mais en voit ${allReclamations.data.length}`);
  }
  
  console.log('✅ Toutes les réclamations récupérées en tant qu\'administrateur');
}

/**
 * Teste la mise à jour du statut d'une réclamation
 */
async function testUpdateReclamationStatus() {
  console.log('🔄 Test de mise à jour du statut de réclamation...');
  
  // Mettre à jour le statut en tant qu'administrateur
  await axios.patch(`${API_URL}/admin/reclamations/${reclamationId}/status`, {
    status: 'RESOLVED',
  }, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  }).catch(err => {
    console.error('Erreur de mise à jour du statut:', err.response?.data || err.message);
    throw new Error('Échec de la mise à jour du statut de la réclamation');
  });
  
  console.log('✅ Statut de réclamation mis à jour');
  
  // Vérifier que le statut a bien été mis à jour
  const updatedReclamation = await axios.get(`${API_URL}/reclamations/me`, {
    headers: {
      'Authorization': `Bearer ${workerToken}`,
    },
  }).then(res => res.data[0]);
  
  if (updatedReclamation.status !== 'RESOLVED') {
    throw new Error(`Le statut devrait être RESOLVED mais est ${updatedReclamation.status}`);
  }
  
  console.log('✅ Statut correctement mis à jour');
}

/**
 * Teste les statistiques des réclamations
 */
async function testReclamationStats() {
  console.log('📊 Test des statistiques de réclamations...');
  
  // Récupérer les statistiques en tant qu'administrateur
  const stats = await axios.get(`${API_URL}/admin/reclamations/stats`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  }).catch(err => {
    console.error('Erreur de récupération des statistiques:', err.response?.data || err.message);
    throw new Error('Échec de la récupération des statistiques');
  });
  
  // Vérifier que les statistiques sont correctes
  const resolvedStats = stats.data.find(s => s.status === 'RESOLVED');
  if (!resolvedStats || resolvedStats.count !== 1) {
    throw new Error('Les statistiques pour RESOLVED devraient montrer 1 réclamation');
  }
  
  console.log('✅ Statistiques correctement récupérées');
}

// Exécuter les tests
runTests();
