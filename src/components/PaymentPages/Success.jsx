import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './Verification.css';


function Success() {
    return (
        <Fragment>
            <div className="h-screen flex flex-col items-center justify-center text-white">
                <img src="/images/success.png" alt="" />
                <h1>Email Verified Successfully!</h1>
                <Link to={"/login"}>
                    <button className={styles.green_btn}>
                        You can now login here
                    </button>
                </Link>
            </div>
        </Fragment>
    )
}

export default Success