import { createRoot } from 'react-dom/client'
// @ts-ignore
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <Provider store={store}>
   <Toaster position="top-center" />
    <App />
 </Provider>

 </BrowserRouter>
)
