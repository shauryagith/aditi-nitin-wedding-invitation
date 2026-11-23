// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { OurStory } from '../sections/OurStory';
import { OurStoryManagementSection } from '../pages/admin/sections/OurStoryManagementSection';
import { LanguageProvider } from '../context/LanguageContext';
import { SocketProvider } from '../context/SocketContext';
import { StoryMilestone } from '../types/wedding';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WEDDING_IMAGE_CATALOG } from '../config/weddingImages';

// Mock IntersectionObserver for Framer Motion
beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.IntersectionObserver = MockIntersectionObserver as any;
});

// Mock Socket.IO client
vi.mock('socket.io-client', () => {
  const mockSocket = {
    connected: true,
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    onAny: vi.fn(),
    offAny: vi.fn(),
    disconnect: vi.fn(),
  };
  return {
    io: vi.fn(() => mockSocket),
  };
});

describe('Real-Time Our Story & CMS Integration Tests', () => {
  it('renders Our Story section with all chapters and verified Cloudinary images', async () => {
    render(
      <SocketProvider>
        <LanguageProvider>
          <OurStory />
        </LanguageProvider>
      </SocketProvider>
    );

    // Verify section title
    expect(screen.getByText('Our Story')).toBeDefined();

    // Verify chapters 1 through 4
    expect(screen.getByText(/When Two Souls First Met/i)).toBeDefined();
    expect(screen.getByText(/Conversations That Blossomed/i)).toBeDefined();
    expect(screen.getByText(/Families United in Joy/i)).toBeDefined();
    expect(screen.getByText(/The Sacred Vow Ahead/i)).toBeDefined();

    // Verify all images have authentic Cloudinary HTTPS URLs
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(4);

    images.slice(0, 4).forEach((img) => {
      const src = img.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).toMatch(/^https:\/\/res\.cloudinary\.com/);
    });
  });

  it('verifies Our Story image catalog contains all 4 distinct Cloudinary URLs', () => {
    const chapters = WEDDING_IMAGE_CATALOG.ourStory;
    expect(chapters.chapter1).toMatch(/^https:\/\/res\.cloudinary\.com/);
    expect(chapters.chapter2).toMatch(/^https:\/\/res\.cloudinary\.com/);
    expect(chapters.chapter3).toMatch(/^https:\/\/res\.cloudinary\.com/);
    expect(chapters.chapter4).toMatch(/^https:\/\/res\.cloudinary\.com/);

    // Ensure all 4 images are distinct
    const uniqueImages = new Set([
      chapters.chapter1,
      chapters.chapter2,
      chapters.chapter3,
      chapters.chapter4,
    ]);
    expect(uniqueImages.size).toBe(4);
  });

  it('renders OurStoryManagementSection in Admin Dashboard with edit inputs and previews', async () => {
    const mockMilestones: StoryMilestone[] = [
      {
        id: 'story-1',
        title: 'When Two Souls First Met',
        titleHi: 'जब दो राहें एक हुईं',
        dateStr: 'Autumn 2024',
        dateStrHi: 'शरद २०२४',
        description: 'A serene afternoon introduction.',
        descriptionHi: 'एक शांत दोपहर की पहली औपचारिक मुलाक़ात।',
        image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg',
        quote: 'In the quietest moments, destiny finds its gentle rhythm.',
        quoteHi: 'जहाँ शब्दों से परे, भावनाएँ अपनी पवित्रता में संवाद करती हैं।',
      },
    ];

    render(
      <OurStoryManagementSection storyMilestones={mockMilestones} onUpdate={vi.fn()} />
    );

    // Verify admin header
    expect(screen.getByText(/Our Story Management/i)).toBeDefined();

    // Verify input fields populated with data
    const titleInput = screen.getByDisplayValue('When Two Souls First Met');
    expect(titleInput).toBeDefined();

    const titleHiInput = screen.getByDisplayValue('जब दो राहें एक हुईं');
    expect(titleHiInput).toBeDefined();

    // Verify action buttons
    expect(screen.getByRole('button', { name: /Add Chapter/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Save & Publish Live/i })).toBeDefined();

    // Verify image preview
    const previewImgs = screen.getAllByRole('img');
    expect(previewImgs.length).toBeGreaterThanOrEqual(1);
    expect(previewImgs[0].getAttribute('src')).toBe(mockMilestones[0].image);
  });
});
