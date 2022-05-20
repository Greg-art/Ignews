import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = { 
  slug: 'my-new-post', title: 'My New Post', content: '<p>content</p>', updatedAt: '10 de Abril'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} /> )

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it('redirects user if no sucbscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ 
      params: { slug: 'my-new-post'} 
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )    
  })



  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post Content'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)    

    const response = await getServerSideProps({ 
      params: { slug: 'my-new-post'} 
    } as any)


    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post:{
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )    
  })
})