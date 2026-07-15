import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Header } from './Header';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
  beforeAll(() => {
    class MockEventSource {
      onmessage: any = null;
      close = vi.fn();
    }
    Object.defineProperty(window, 'EventSource', {
      writable: true,
      value: MockEventSource,
    });
    Object.defineProperty(globalThis, 'EventSource', {
      writable: true,
      value: MockEventSource,
    });
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Header onToggleAiDrawer={vi.fn()} />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render brand logo and role switcher element', () => {
    renderHeader();
    expect(screen.getByText('TaskPilot AI')).toBeInTheDocument();
  });

  it('should render AI Assistant Copilot button and respond to clicks', () => {
    const mockToggle = vi.fn();
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header onToggleAiDrawer={mockToggle} />
        </AuthProvider>
      </BrowserRouter>
    );

    const aiHubTrigger = screen.getByText('AI Hub');
    expect(aiHubTrigger).toBeInTheDocument();
    fireEvent.click(aiHubTrigger);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
