import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="WS-Landing-Page">
            <div>소개글</div>
            <div>링크 사용 설명/소개</div>
            <div>트래블 사용 설명/소개</div>
            <div>위시 사용 설명/소개</div>
            <div>마치며</div>
            <button className="WS-Landing-Page-Button" onClick={() => navigate('/link')}>My Travel Link 시작하기</button>
        </div>
    )
}

export default LandingPage;