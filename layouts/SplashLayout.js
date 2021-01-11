import SplashContainer from '../components/SplashContainer';
import SplashHeader from '../components/SplashHeader';

const SplashLayout = props => (
    <>
        <SplashContainer>
            <SplashHeader />
            {props.children}
        </SplashContainer>
        <div style={{ height:'350px' }}>What this website is about</div>
    </>
);

export default SplashLayout;
