import { useNavigate  } from 'react-router-dom';

export default function ClientFooter(){
    
    let navigate = useNavigate();

    const handleLogout = (e)=>{
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        
        <footer className="flex w-full flex-wrap bg-black  h-14 mt-4">
            <div className="max-w-screen-xl p-4 md:flex">
            <ul className="flex mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="/faq" className="mr-4 hover:underline md:mr-6">FAQ</a>
                </li>
                <li>
                    <a href="/contact-us" className="mr-4 hover:underline md:mr-6">Contact Us</a>
                </li>
                <li>
                    <button onClick={handleLogout} className="hover:underline">Logout</button>
                </li>
            </ul>
            </div>
        </footer>

    );

}