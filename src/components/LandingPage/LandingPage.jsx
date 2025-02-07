import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="WS-Landing-Page">
            <button className="WS-Landing-Page-Button" onClick={() => navigate('/link')}>My Travel Link 시작하기</button>
        </div>
    )
}

export default LandingPage;