import { render, screen, waitFor } from '@testing-library/react'
import { Async } from '.'

it('renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello')).toBeInTheDocument
  

  await waitFor(() => {
    return expect(screen.getByText('Butão')).toBeInTheDocument
  })

})