module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Montserrat', 'system-ui', 'sans-serif'],
        'body': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        'custom-brown': '#52392F',
        'custom-gold': '#B89336',
      }
    },
  },
  plugins: [],
}