import { SplashContainer, SplashHeader } from '../components/SplashUtils';

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
