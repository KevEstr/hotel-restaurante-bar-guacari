import React from 'react';
import { useDispatch } from 'react-redux';
import { setSection } from '../actions/SectionAction';
import { logout } from '../actions/userActions';


const Header = () => {
    const dispatch = useDispatch()

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logout()) 
    }

    const handleSetSection = (section) => {
        dispatch(setSection(section));
    }

    return (
        
       
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <ul className="navbar-nav">
                <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href="/" role="button"><i className="fas fa-bars" /></a>
                </li>

                <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSetSection('hotel')}
                    className="nav-link"
                    data-widget="control-sidebar"
                    data-slide="true"
                    role="button"
                >
                    <i className="fas fa-solid fa-hotel"></i> Hotel
                </span>

                <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSetSection('restaurante')}
                    className="nav-link"
                    data-widget="control-sidebar"
                    data-slide="true"
                    role="button"
                >
                    <i className="fas fa-utensils"></i> Restaurante
                </span>

            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <span
                    style={{cursor:'pointer'}} 
                    onClick={(e) => handleLogout(e)}
                    className="nav-link" 
                    data-widget="control-sidebar" 
                    data-slide="true"  
                    role="button">
                        <i className="fas fa-power-off"></i> Salir
                </span>
                </li>
            </ul>
        </nav>
   
     );
}
 
export default Header;