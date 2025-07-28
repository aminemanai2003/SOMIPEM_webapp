import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReclamationForm from '../components/reclamation/ReclamationForm';
import ReclamationCard from '../components/reclamation/ReclamationCard';
import { vi, describe, it, expect } from 'vitest';
import { Reclamation, ReclamationStatus } from '../types';
import '@testing-library/jest-dom';

// Mock data
const mockReclamation: Reclamation = {
  id: '1',
  title: 'Problème d\'équipement',
  description: 'Mon équipement est défectueux',
  status: ReclamationStatus.PENDING,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user-1',
};

// Mock services
vi.mock('../services/reclamation.service', () => ({
  ReclamationService: {
    createReclamation: vi.fn().mockResolvedValue(mockReclamation),
    updateReclamationStatus: vi.fn().mockResolvedValue({ ...mockReclamation, status: 'RESOLVED' }),
  },
}));

// Setup wrapper
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('ReclamationForm', () => {
  it('renders the form correctly', () => {
    renderWithProviders(<ReclamationForm onSubmit={() => {}} isLoading={false} />);
    
    expect(screen.getByText('Soumettre une nouvelle réclamation')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Soumettre la réclamation')).toBeInTheDocument();
  });
  it('calls onSubmit when submitted', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<ReclamationForm onSubmit={mockSubmit} isLoading={false} />);
    
    await user.type(screen.getByLabelText('Titre'), 'Test Title');
    await user.type(screen.getByLabelText('Description'), 'Test Description');
    await user.click(screen.getByRole('button', { name: /soumettre la réclamation/i }));
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('ReclamationCard', () => {
  it('displays reclamation details', () => {
    renderWithProviders(
      <ReclamationCard 
        reclamation={mockReclamation} 
        isAdmin={false} 
        onStatusChange={() => {}} 
      />
    );
    
    expect(screen.getByText(mockReclamation.title)).toBeInTheDocument();
    expect(screen.getByText(mockReclamation.description)).toBeInTheDocument();
  });
  it('shows status change controls for admin users', () => {
    renderWithProviders(
      <ReclamationCard 
        reclamation={mockReclamation} 
        isAdmin={true} 
        onStatusChange={() => {}} 
      />
    );
    
    // Admin should see status change controls - check for presence of any buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check specifically for the "Résoudre" button
    expect(screen.getByText('Résoudre')).toBeInTheDocument();
  });
});
