import { render, screen } from '@testing-library/react'
import { Button } from '../components/ui/button'

// Mock the Slot component from @radix-ui/react-slot
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the cn function from @/lib/utils
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Button Component', () => {
  it('renders a button with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<Button className="test-class">Custom Button</Button>)
    const button = screen.getByRole('button', { name: 'Custom Button' })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('test-class')
  })

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })
})
