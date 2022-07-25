import { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
    code: string;
    err: string;
}

const html = `
<html>
    <head>
        <style>html {background-color:white;}</style>
    </head>
    <body>
        <div id="root"></div>
        <script>
            const handleError = (err) => {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + err + '</div>';
                console.error(err);
            };
            window.addEventListener('error', (event) => {
                event.preventDefault();
                handleError(event.error)
            })
            window.addEventListener('message', (event)=> {
                try {
                    eval(event.data);
                } catch (err) {
                    handleError(err)
                }
            })
        </script>
    </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html; //reset iframe contents on every click in case user messes it up
        setTimeout(() => {
            iframe.current.contentWindow.postMessage(code, '*');
        }, 50);
    }, [code]);

    return (
        <div className="preview-wrapper">
            <iframe
                title="preview"
                ref={iframe}
                sandbox="allow-scripts"
                srcDoc={html}
            />
            {err && (
                <div className="preview-error">
                    <h4>
                        <b>Compilation error:</b>
                    </h4>
                    <br />
                    {err}
                </div>
            )}
        </div>
    );
};

export default Preview;
