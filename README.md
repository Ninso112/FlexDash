# FlexDash

A customizable homepage / dashboard website that can be easily hosted as a GitHub repository and published via GitHub Pages.

## ✨ Features

- **Shortcuts / Favorite Links**: Create your own shortcuts to your favorite websites with configurable icons and sizes
- **Background / Theme**: Choose from 16 predefined colors or use your own background image
- **Weather Display** (optional): Weather widget with location input (uses the free Open-Meteo API)
- **Personal Message**: Display a personalized greeting on your dashboard
- **Search Bar**: Central search bar with selection of various search engines (Google, DuckDuckGo, Startpage, Ecosia, Bing)
- **Drag & Drop**: All elements are freely movable with optional grid mode
- **Responsive Design**: Works on PC, tablet, and smartphone
- **Client-side Storage**: All settings are stored in the browser (localStorage)

## 🚀 Quick Start

### 1. Fork or clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/FlexDash.git
cd FlexDash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

The application will run on `http://localhost:5173`

### 4. Create production build

```bash
npm run build
```

The build will be created in the `dist/` folder.

## 📦 GitHub Pages Deployment

### Option 1: Automatic Deployment (recommended)

The project already includes a GitHub Actions workflow file (`.github/workflows/deploy.yml`) that automatically deploys on every push to the `main` branch.

1. **Create repository on GitHub** (if not already done)
2. **Push code**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/FlexDash.git
   git push -u origin main
   ```
3. **Enable GitHub Pages** (IMPORTANT - do this first!):
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source** select **GitHub Actions**
   - Click **Save** (if you see a warning, ignore it for now)
   - The workflow file will automatically run and deploy on the next push
   
   **Note:** If the workflow fails with "Get Pages site failed", make sure you've enabled GitHub Pages in Settings → Pages first, then push again or manually trigger the workflow.

### Option 2: Manual Deployment

1. **Create build**:
   ```bash
   npm run build
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source** select **Deploy from a branch**
   - Select the `gh-pages` branch and the `/ (root)` folder
   - Click **Save**

3. **Push build to GitHub Pages branch**:
   ```bash
   npm run build
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

   Or use the `gh-pages` npm package:
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```

## 🎨 Usage

### Open Settings

Click on the **⚙️ Settings icon** (top right) to open the settings panel.

### Add Shortcuts

1. Open settings
2. Scroll to the **Shortcuts** section
3. Fill in the fields:
   - **Name** (optional): Name of the shortcut
   - **URL** (required): The target URL
   - **Emoji Icon**: An emoji as icon (e.g. 🔗, 🌐, 📧)
   - **Icon URL** (optional): URL to an image icon
   - **Size**: Small, Medium, or Large
4. Click **Add**
5. Shortcuts can be moved on the dashboard via drag & drop

### Configure Background

1. Open settings
2. Under **Background** choose either:
   - **Color**: Choose from 16 predefined colors
   - **Image**: Enter an image URL

### Enable Weather Widget

1. Open settings
2. Enable the **Weather Widget**
3. Enter a **city name** (e.g. "Berlin")
4. The widget will automatically display and update

### Personal Message

1. Open settings
2. Enter your greeting under **Personal Message** (e.g. "Good morning, Alex!")
3. The message will be prominently displayed on the dashboard

### Select Search Engine

1. Open settings
2. Under **Search Engine** select your preferred search engine
3. Available options: Google, DuckDuckGo, Startpage, Ecosia, Bing

### Grid Mode

Click on the **⊞ Grid icon** (top right) to toggle between free movement and grid mode. In grid mode, all elements snap to a 20x20 pixel grid.

## 🛠️ Technologies

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **react-draggable**: Drag & drop functionality
- **Open-Meteo API**: Free weather API (no API key required)

## 📁 Project Structure

```
FlexDash/
├── src/
│   ├── components/          # React components
│   │   ├── PersonalMessage.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── Shortcut.jsx
│   │   ├── ShortcutManager.jsx
│   │   └── WeatherWidget.jsx
│   ├── styles/              # CSS files
│   ├── utils/               # Utilities
│   │   └── storage.js       # localStorage functions
│   ├── App.jsx              # Main component
│   └── main.jsx             # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Customization

### Add New Background Colors

Edit `src/components/SettingsPanel.jsx` and add colors to the `BACKGROUND_COLORS` array.

### Add New Search Engines

Edit `src/components/SearchBar.jsx` and add entries to the `SEARCH_ENGINES` object. Don't forget to also extend the options in `SettingsPanel.jsx`.

### Adjust Shortcut Sizes

Edit `src/components/Shortcut.css` and adjust the CSS classes `.shortcut-small`, `.shortcut-medium`, and `.shortcut-large`.

## 📝 License

See [LICENSE](LICENSE) file.

## 🤝 Contributing

Contributions are welcome! Please create a pull request or open an issue.

## 📧 Support

For questions or problems, please open an issue on GitHub.

---

**Enjoy your personalized dashboard! 🎉**
