import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import {SceneComponent, sceneDemo} from "@site/src/components/Scene/SceneComponents";

function CustomLink({children, className, to}) {
    return (<Link className={`${styles.mainButton} ${className}`} to={to}>
        {children}
    </Link>)
}

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className="container">
                <img src={'/img/scene.png'} alt={'logo'}/>
                <h1>{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <CustomLink
                        className={styles.mainButtonRed}
                        to="/docs/intro">
                        Get Started
                    </CustomLink>
                    <CustomLink
                        className={styles.mainButtonPurple}
                        to="/docs/user-interactions">
                        User
                    </CustomLink>
                    <CustomLink
                        className={styles.mainButtonDPurple}
                        to="/docs/developer-interactions">
                        Developer
                    </CustomLink>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Scene.js`}
            description="Scene.js for scene blocking and staging">
            <HomepageHeader/>
            <main className={styles.mainContainer}>
                <SceneComponent {...sceneDemo} width={'90%'} height={'800px'}/>
            </main>
        </Layout>
    );
}
