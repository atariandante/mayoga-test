import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';

// Components
import { Layout } from '../../components/Layout';

// Theme
import { theme } from '../../theme';

const App = ({ Component, pageProps }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
};

export default App;
