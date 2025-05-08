import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the useEffect hook since we're testing a client component
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((cb) => cb()),
}));

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>
  },
}));

describe('Home Page', () => {
  it('renders the home page heading', () => {
    render(<Home />)
    // Check for the heading text
    expect(screen.getByText('Notun Thikana Bangladesh')).toBeInTheDocument()
  })
})
