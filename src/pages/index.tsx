import { GetStaticProps } from 'next'
import Head from 'next/Head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps{
  product:{
    priceId: string;
    amount: number;
  }
}

export default function Home( {product}:HomeProps ) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>    
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>    
  )
}

// 3 formas de popular com informações
// Client-side ( quando não necessita indexação )
// Server-side (para indexação dinâmida)
// Static Site Generation (para telas que não mudam com frequência)

// "export const getServerSideProps: GetServerSideProps = async () => {"
// tem q ter esse nome, tem q ser async, e ser uma const pra ter tipagem
// as props retornadas aqui, serão retornadas nas props da função default
// o código rodado aqui acontece antes de chegar no browser

//mudando para "getStaticProps", usar SSG ou seja, salva o HTML pra n fazer tanta requisição
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KbTSmCwIUwbqrFo1QtT59si')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return{
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}

