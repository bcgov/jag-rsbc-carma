import './environment';  // Must be first
import app from './app';
const PORT = process.env.PORT || 3001;
app.listen(PORT).on('listening', () => {
    console.log(`Carma API started on port ${PORT}...`);
    console.log(`DATE: ${new Date().toString()}`)
}); 
