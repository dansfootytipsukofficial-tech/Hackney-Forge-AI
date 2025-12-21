import axios from 'axios';

const API_BASE_URL = '/api';

// AI Gang Member queries
export const getGangMembers = async () => {
  const response = await axios.get(`${API_BASE_URL}/ai/gang-members`);
  return response.data;
};

export const queryGangMember = async (gangMemberId, message, conversationHistory = []) => {
  const response = await axios.post(`${API_BASE_URL}/ai/query/${gangMemberId}`, {
    message,
    conversationHistory
  });
  return response.data;
};

export const queryBossAI = async (message, conversationHistory = []) => {
  const response = await axios.post(`${API_BASE_URL}/ai/boss-query`, {
    message,
    conversationHistory
  });
  return response.data;
};

// Custom AI
export const createCustomAI = async (aiData) => {
  const response = await axios.post(`${API_BASE_URL}/ai/custom-ai`, aiData);
  return response.data;
};

export const getCustomAIs = async () => {
  const response = await axios.get(`${API_BASE_URL}/ai/custom-ai`);
  return response.data;
};

export const queryCustomAI = async (customAIId, message) => {
  const response = await axios.post(`${API_BASE_URL}/ai/custom-ai/${customAIId}/query`, {
    message
  });
  return response.data;
};

// User
export const getUserStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/stats`);
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_BASE_URL}/user/profile`, userData);
  return response.data;
};

// Subscription
export const getSubscriptionStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/subscription/status`);
  return response.data;
};

export const subscribeMonthly = async (paymentMethodId) => {
  const response = await axios.post(`${API_BASE_URL}/subscription/subscribe/monthly`, {
    paymentMethodId
  });
  return response.data;
};

export const payPerQuery = async (paymentMethodId) => {
  const response = await axios.post(`${API_BASE_URL}/subscription/pay-per-query`, {
    paymentMethodId
  });
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axios.post(`${API_BASE_URL}/subscription/cancel`);
  return response.data;
};

// Gamification
export const getChallenges = async () => {
  const response = await axios.get(`${API_BASE_URL}/gamification/challenges`);
  return response.data;
};

export const completeChallenge = async (challengeId) => {
  const response = await axios.post(`${API_BASE_URL}/gamification/challenges/${challengeId}/complete`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/gamification/leaderboard`);
  return response.data;
};
