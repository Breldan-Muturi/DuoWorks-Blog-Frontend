import Layout from '../components/Layout';
import Link from 'next/link';

const Index = () => {
    return (
        <Layout>
            <article className="overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h1 className="display-4 font-weight-bold">
                                DUOWORKS CREATIVES
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center pt-4 pb-5">
                            <p className="lead">
                              Find passionate Creatives so you can create content for yourself or your business for the world to see.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="flip flip-horizontal">
                                <div
                                    className="front"
                                    style={{
                                        backgroundImage:
                                            'url(' +
                                            'https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg' +
                                            ')'
                                    }}
                                >
                                    <h2 className="text-shadow text-center h1">Photography</h2>
                                </div>
                                <div className="back text-center">
                                    <Link href="/categories/Photography">
                                        <a>
                                            <h3 className="h1">Photography</h3>
                                        </a>
                                    </Link>
                                    <p className="lead">Find those passionate about Photography</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="flip flip-horizontal">
                                <div
                                    className="front"
                                    style={{
                                        backgroundImage:
                                            'url(' +
                                            'https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg' +
                                            ')'
                                    }}
                                >
                                    <h2 className="text-shadow text-center h1">Mobile development</h2>
                                </div>
                                <div className="back text-center">
                                    <Link href="/categories/mobile-development">
                                        <a>
                                            <h3 className="h1">Mobile development</h3>
                                        </a>
                                    </Link>
                                    <p className="lead">
                                        Meet the finest mobile developers
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="flip flip-horizontal">
                                <div
                                    className="front"
                                    style={{
                                        backgroundImage:
                                            'url(' +
                                            'https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg' +
                                            ')'
                                    }}
                                >
                                    <h2 className="text-shadow text-center h1">Web development</h2>
                                </div>
                                <div className="back text-center">
                                    <Link href="/categories/web-development">
                                        <a>
                                            <h3 className="h1">Web development</h3>
                                        </a>
                                    </Link>
                                    <p className="lead">Boost traffic to your business through competent web developers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Layout>
    );
};

export default Index;