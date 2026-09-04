import { Moon, Sun } from 'lucide-react'
import { useTheme } from './context/ThemeContext'
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'} title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
}
