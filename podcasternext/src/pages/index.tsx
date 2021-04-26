import { GetStaticProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { api } from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { convertDurationToTImeString } from '../utils/convertDurationToTImeString'

import styles from './home.module.scss'
import {  userPlayer } from '../contexts/playerContext'

type Episode = {
  id: string;
  title: string;
  thumbnail: string; 
  members: string;
  publishedAt: string;
  durationAsString: number;
  url: string;
}

type HomeProps = {
  latestEpisodies: Episode[];
  allEpisodies: Episode[];
}

export default function Home({ latestEpisodies, allEpisodies }: HomeProps) {

  const { playList } = userPlayer()

  const episodeList = [...latestEpisodies, ...allEpisodies]

  return (
    <div className={styles.homepage} >
      <Head>
      <link rel="shortcut icon" href="/favicon.png"/>
        <title>Home | Podcaster</title>
      </Head>

      <section className={styles.lastedEpisodes}>
        <h2>Útimos lançamentos</h2>

        <ul>
          {latestEpisodies.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                  />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)} >
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodies.map((episode, index) => {
              return (
                <tr style={{ width: 72 }} key={episode.id}>
                  <td>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{convertDurationToTImeString(episode.durationAsString)}</td>
                  <td>

                    <button type="button" onClick={() => {
                      playList(episodeList, index + latestEpisodies.length)
                    }} >
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail, 
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBr }),
      durationAsString: episode.file.duration,
      url: episode.file.url
    };
  })

  const latestEpisodies = episodes.slice(0, 2)
  const allEpisodies = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodies,
      allEpisodies
    },
    revalidate: 60 * 60 * 8
  }
}

