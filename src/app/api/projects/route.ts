import { NextResponse } from 'next/server';

const projects = [
  {
    id: 1,
    title: 'Animated 3D Portfolio',
    description: 'A modern portfolio with smooth 3D card animations.',
    url: '#',
  },
  {
    id: 2,
    title: 'Backend API Demo',
    description: 'Simple API endpoint demonstrating server logic.',
    url: '#',
  },
];

export function GET() {
  return NextResponse.json(projects);
}
