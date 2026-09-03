# CodeSpire - Quick Start Guide

Get CodeSpire up and running in minutes!

---

## ⚡ 30-Second Setup

```bash
# Clone and install
git clone <repository-url>
cd codespire
npm install

# Start development server
npm start
```

That's it! Open `http://localhost:3000` in your browser.

---

## 🎯 First Steps

### 1. Explore the Homepage
- 👀 See the search bar with employment statistics
- 🔍 Try searching for "Machine Learning" or "Data Analyst"
- 📊 View featured learning paths

### 2. Toggle Dark Mode
- 🌙 Click the theme toggle in the header
- ✨ Watch the app transform to dark mode
- 🎨 All components styled perfectly

### 3. Select a Learning Path
- 📚 Click "Explore AI" or "Explore Data Science"
- 📈 View comprehensive employment statistics
- 💼 Explore career opportunities with salary data
- 🎓 Check learning roadmap and courses

### 4. Get Support
- 💬 Scroll to footer
- 🔗 Click Facebook or Email link
- ✉️ Choose your preferred contact method

---

## 📦 What You Get

### Features Included
✅ Advanced search functionality  
✅ Employment statistics by region  
✅ Career opportunity details  
✅ Dark/light mode toggle  
✅ Responsive mobile design  
✅ Customer support integration  
✅ Modern UI with smooth animations  

### Responsive Breakpoints
📱 Mobile: 320px - 480px  
📱 Tablet: 481px - 768px  
🖥️ Desktop: 769px+  

---

## 🚀 Available Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Create production build |
| `npm test` | Run tests in watch mode |
| `npm run eject` | Eject from Create React App (irreversible) |

---

## 🎨 Customization

### Change Theme Colors
Edit `src/context/ThemeContext.js` for dark mode colors.

### Modify Field Data
Edit `src/data/fieldData.js` to add/update:
- Employment statistics
- Career opportunities
- Learning roadmaps
- Courses

### Update Search
Modify `src/components/SearchBar.js` to customize:
- Search result count
- Search behavior
- Suggestion styling

---

## 🌙 Dark Mode Guide

### Automatic Detection
CodeSpire automatically detects your system preference:
- Windows/Mac: System theme preference
- Mobile: Phone theme setting

### Manual Toggle
Click the theme toggle button in the header to switch manually.

### Styling
All components include dark mode support:
- SearchBar ✅
- Footer ✅
- Hero Section ✅
- Field Cards ✅
- All Sections ✅

---

## 📱 Mobile Testing

### Test on Different Devices
```bash
# Use Chrome DevTools
1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Click device icon (top-left)
4. Select device or custom size
```

### Supported Devices
- ✅ iPhone (all sizes)
- ✅ iPad / Tablets
- ✅ Android phones
- ✅ Responsive web design

---

## 🔍 Finding Features

| Feature | Location |
|---------|----------|
| Search | Hero section (homepage) |
| Employment Stats | Field detail page (top) |
| Career Info | Field detail page (middle) |
| Support Links | Footer (bottom) |
| Dark Mode | Header (top-right) |
| Learning Paths | Field detail page |

---

## 🐛 Quick Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
# or kill process using port 3000
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues
```bash
# Hard refresh browser
Ctrl + Shift + Delete
# or
Cmd + Shift + Delete (Mac)
```

### Dark Mode Not Working
Check if:
- ThemeContext.js exists in `src/context/`
- Components import useTheme hook
- CSS has dark mode classes

---

## 📚 Documentation

### Main Docs
- **README.md** - Complete documentation
- **STYLING_FIXES.md** - Dark mode improvements
- **DEPLOYMENT_CHECKLIST.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Project overview

### Getting Help
1. Check README.md first
2. Look for similar issues on GitHub
3. Create a GitHub issue if stuck
4. Contact via Facebook or Email (footer)

---

## 🚀 Deployment

### Deploy to Netlify (Easy)
```bash
npm run build
# Install Netlify CLI
npm install -g netlify-cli
# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm install gh-pages
npm run build
npm run deploy
```

---

## 📊 Project Stats

- **Components**: 20+
- **Styles**: 10+ CSS files
- **Build Size**: 70.52 kB (JS) + 42.29 kB (CSS)
- **Load Time**: ~2-3 seconds
- **Responsive**: Fully responsive
- **Accessibility**: WCAG AA compliant

---

## 💡 Pro Tips

1. **Use DevTools Console**
   - Check for errors and warnings
   - Debug component props
   - Monitor performance

2. **Browser Extensions**
   - Install React DevTools
   - Install Redux DevTools (if using)
   - Check with Lighthouse for performance

3. **Code Organization**
   - Components in `src/components/`
   - Styles in component directories
   - Data in `src/data/`
   - Context in `src/context/`

4. **Best Practices**
   - Use functional components
   - Leverage React Hooks
   - Keep components small and focused
   - Comment complex logic

---

## 🎓 Learning Resources

### React
- [React Official Docs](https://reactjs.org/)
- [React Hooks Guide](https://react-hooks-example.com/)
- [Create React App Docs](https://create-react-app.dev/)

### Styling
- [CSS-in-JS Guide](https://styled-components.com/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Bootstrap Documentation](https://getbootstrap.com/)

### Deployment
- [Netlify Deployment](https://www.netlify.com/)
- [Vercel Deployment](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

---

## ✅ Verification Checklist

After setup, verify:
- [ ] App runs on localhost:3000
- [ ] All pages load without errors
- [ ] SearchBar works with real-time suggestions
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile
- [ ] Footer links are clickable
- [ ] All career data displays correctly

---

## 🎉 You're Ready!

CodeSpire is now running on your machine. Start exploring and customizing!

### Next Steps
1. Explore the codebase
2. Make your first change
3. Test in dark mode
4. Deploy to production
5. Share with others!

---

**Happy Coding! 🚀**

For questions or issues, refer to README.md or contact support via footer.
