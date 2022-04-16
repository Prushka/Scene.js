import React, {useEffect, useLayoutEffect, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import {SceneComponent, sceneDemo, sceneDemoLanding} from "@site/src/components/Scene/SceneComponents";
import BrowserOnly from "@docusaurus/BrowserOnly";

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
                        className={styles.mainButton1}
                        to="/docs/intro">
                        Get Started
                    </CustomLink>

                    <CustomLink
                        className={styles.mainButton2}
                        to="/docs/user-interactions">
                        User
                    </CustomLink>
                    <CustomLink
                        className={styles.mainButton3}
                        to="/docs/developer-interactions">
                        Developer
                    </CustomLink>
                    <CustomLink
                        className={styles.mainButton4}
                        to="/docs/global-config">
                        Global - Config
                    </CustomLink>
                    <CustomLink
                        className={styles.mainButton5}
                        to="/docs/prop-config">
                        Prop - Config
                    </CustomLink>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    const {scene, uid} = sceneDemoLanding;
    // I don't know why useEffect gets called before DOM ready if this landing page is first loaded in.
    // i.e., query the document doesn't work in useEffect in this landing page when you refresh it.
    // It works in all other pages.
    // This may be an issue with docusaurus? IDK
    // The code below works (I don't know if it's reliable)
    const [isLoaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(true)
    }, [])
    useEffect(()=>{
        if(isLoaded){
            scene.display()
        }
    },[isLoaded])
    return (<BrowserOnly>
        {
            () =>
                <Layout
                    title={`Scene.js`}
                    description="Scene.js for scene blocking and staging">
                    <HomepageHeader/>
                    <main className={styles.mainContainer}>
                        <div id={uid} style={{width: '90%', height: '800px'}}></div>
                    </main>
                </Layout>

        }
    </BrowserOnly>
    );
}
