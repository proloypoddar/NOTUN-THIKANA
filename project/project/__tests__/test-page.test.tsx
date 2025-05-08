import { render, screen, fireEvent } from '@testing-library/react'
import TestPage from '../app/test/page'

// Mock the useState hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initialValue) => [initialValue, jest.fn()]),
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, asChild }: any) => {
    return asChild ? children : <button onClick={onClick}>{children}</button>
  },
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>
  },
}));

describe('Test Page', () => {
  it('renders the test page heading', () => {
    render(<TestPage />)
    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  it('displays the counter', () => {
    render(<TestPage />)
    expect(screen.getByText(/Counter: \d+/)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<TestPage />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Forums')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
