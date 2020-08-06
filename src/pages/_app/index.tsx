import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';
import { motion } from 'framer-motion';
import { AppProps } from 'next/app';

// Components
import { Layout } from '../../components/Layout';

// Theme
import { theme } from '../../theme';

const App = ({ Component, pageProps, router }: AppProps ) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Layout>
                <motion.div key={router.route} initial="pageInitial" animate="pageAnimate" variants={{
                    pageInitial: {
                        opacity: 0
                    },
                    pageAnimate: {
                        opacity: 1
                    },
                }}>
                    <Component {...pageProps} />
                </motion.div>
            </Layout>
        </ThemeProvider>
    );
};

export default App;
