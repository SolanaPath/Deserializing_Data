"use client";

import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import {useConnection} from "@solana/wallet-adapter-react";
import {publicKey} from "@solana/web3.js/src/layout";
import {PublicKey} from "@solana/web3.js";

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
    const { connection } = useConnection();
    const [movies, setMovies] = useState<Movie[]>([])

    useEffect(() => {
        connection.getProgramAccounts(new PublicKey(MOVIE_REVIEW_PROGRAM_ID))
            .then(async (accounts) => {
                const movies: (Movie | null)[] = accounts.map(({ account }) => {
                    return Movie.deserialize(account.data);
                });
                const filteredMovies: Movie[] = movies.filter((movie): movie is Movie => movie !== null);

                setMovies(filteredMovies);
            })
            .catch((error) => {
                console.error('Error fetching program accounts:', error);
            });
    }, [connection]);

    return (
        <div>
            {
                movies.map((movie, i) => <Card key={i} movie={movie} /> )
            }
        </div>
    )
}