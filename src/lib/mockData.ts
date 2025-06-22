// Mock data for the application - all data should come from this file
export const mockCards = [
  {
    id: '1',
    title: 'Welcome Note',
    content: 'Welcome to your card collection! This is your first card. You can edit this text by clicking the pencil icon.',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '2',
    title: 'Quick Ideas',
    content: 'Quick Ideas\n\n- Build a note-taking app\n- Learn more about IndexedDB\n- Practice TypeScript\n- Explore new design patterns',
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  }
];