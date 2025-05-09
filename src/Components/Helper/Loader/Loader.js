import { HashLoader } from "react-spinners"


export const Loader = () => {
    return (
        <>
            <div className="loader_style"
                // style={{
                //     display: 'flex',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     height: '100vh',  // Full height of the viewport
                //     width: '100vw',   // Full width of the viewport
                //     position: 'absolute', // Absolute positioning to cover the viewport
                //     top: 0,
                //     left: 0,
                //     backgroundColor: 'transparent' // Optional background color
                // }}
            >
                <HashLoader color="#4C3B77"  size={50} />
            </div>
        </>
    )
}