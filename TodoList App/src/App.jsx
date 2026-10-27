import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineClock } from "react-icons/hi2";
import { v4 as uuidv4 } from 'uuid';

function App() { 
  const [todo, setTodo] = useState("")
  const [minutes, setMinutes] = useState("") 
  const [seconds, setSeconds] = useState("") 
  
  const [todos, setTodos] = useState(() => {
    const todoString = localStorage.getItem("todos")
    if (todoString) {
      try {
        const parsed = JSON.parse(todoString)
        const now = Date.now();
        return parsed.map(item => {
          // Preserve existing targetTime if valid, otherwise check if old duration existed
          let targetTime = item.targetTime;
          if (!targetTime && item.timeLeft > 0) {
            targetTime = now + (item.timeLeft * 1000);
          } else if (!targetTime && item.duration > 0) {
            targetTime = now + (item.duration * 1000);
          }
          return {
            ...item,
            targetTime: targetTime || null,
            hasExpired: item.hasExpired || false
          }
        })
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error)
      }
    }
    return []
  })

  const [showFinished, setShowFinished] = useState(true)

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  // Timer Tick Effect (Only runs for tasks with a valid targetTime)
  useEffect(() => {
    const interval = setInterval(() => {
      setTodos(prevTodos => {
        let hasChanges = false;
        const now = Date.now();
        
        const updated = prevTodos.map(item => {
          // Only process uncompleted tasks that have an active targetTime set
          if (!item.isCompleted && item.targetTime) {
            hasChanges = true;
            const timeLeft = Math.max(0, Math.ceil((item.targetTime - now) / 1000));
            
            // When time hits 0 and hasn't already triggered an alert
            if (timeLeft === 0 && !item.hasExpired) {
              setTimeout(() => {
                const addMoreTime = window.confirm(
                  `Time is up for your task: "${item.todo}"\n\nClick OK to set more time, or Cancel to delete this task.`
                );

                if (addMoreTime) {
                  const extraMins = window.prompt("Enter additional minutes:", "0");
                  const extraSecs = window.prompt("Enter additional seconds:", "0");
                  const parsedMins = extraMins ? parseInt(extraMins, 10) || 0 : 0;
                  const parsedSecs = extraSecs ? parseInt(extraSecs, 10) || 0 : 0;
                  const totalExtraSecs = (parsedMins * 60) + parsedSecs;

                  if (totalExtraSecs > 0) {
                    setTodos(current => 
                      current.map(t => t.id === item.id ? { 
                        ...t, 
                        targetTime: Date.now() + (totalExtraSecs * 1000), 
                        hasExpired: false 
                      } : t)
                    );
                  } else {
                    setTodos(current => current.filter(t => t.id !== item.id));
                  }
                } else {
                  setTodos(current => current.filter(t => t.id !== item.id));
                }
              }, 100);

              return { ...item, targetTime: null, hasExpired: true };
            }
          }
          return item;
        });

        if (hasChanges) {
          saveToLS(updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  const handleEdit = (e, id) => { 
    let t = todos.filter(i => i.id === id) 
    setTodo(t[0].todo)
    
    const now = Date.now();
    const remainingSecs = t[0].targetTime ? Math.max(0, Math.ceil((t[0].targetTime - now) / 1000)) : 0;
    
    const m = Math.floor(remainingSecs / 60);
    const s = remainingSecs % 60;
    setMinutes(m > 0 ? m.toString() : "")
    setSeconds(s > 0 ? s.toString() : "")

    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos) 
    saveToLS(newTodos)
  }

  const handleDelete = (e, id) => {  
    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos) 
    saveToLS(newTodos)
  }

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;
    
    const mins = minutes ? parseInt(minutes, 10) || 0 : 0;
    const secs = seconds ? parseInt(seconds, 10) || 0 : 0;
    const totalSeconds = (mins * 60) + secs;

    const newTask = { 
      id: uuidv4(), 
      todo, 
      targetTime: totalSeconds > 0 ? Date.now() + (totalSeconds * 1000) : null,
      hasExpired: false,
      isCompleted: false 
    }

    const newTodos = [...todos, newTask]
    setTodos(newTodos)
    setTodo("") 
    setMinutes("")
    setSeconds("")
    saveToLS(newTodos)
  }
  
  const handleChange = (e) => { 
    setTodo(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && todo.trim().length > 3) {
      handleAdd()
    }
  }

  const handleCheckbox = (e) => { 
    let id = e.target.name;  
    let index = todos.findIndex(item => item.id === id) 
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  const formatTime = (targetTime) => {
    if (!targetTime) return null;
    const remainingSecs = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
    if (remainingSecs <= 0) return null;
    const mins = Math.floor(remainingSecs / 60);
    const secs = remainingSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const completedCount = todos.filter(t => t.isCompleted).length

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-700">
      <Navbar totalTasks={todos.length} completedCount={completedCount} /> 

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8">
        
        {/* Main Card Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/50 border border-slate-200/80">
          
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Timed Tasks</h1>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-bold">
              {todos.length} tasks total • <span className="text-emerald-600">{completedCount} completed</span>
            </p>
          </div>

          {/* Input Box Area */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <input  
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              value={todo} 
              type="text" 
              placeholder="What needs to be done? (min 4 chars)" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
            />
            
            <div className="flex gap-2">
              <input 
                onChange={(e) => setMinutes(e.target.value)}
                value={minutes}
                type="number"
                min="0"
                placeholder="Min"
                className="w-16 bg-slate-50 border border-slate-200 rounded-2xl px-2 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white text-center shadow-xs"
                title="Minutes"
              />
              <input 
                onChange={(e) => setSeconds(e.target.value)}
                value={seconds}
                type="number"
                min="0"
                max="59"
                placeholder="Sec"
                className="w-16 bg-slate-50 border border-slate-200 rounded-2xl px-2 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white text-center shadow-xs"
                title="Seconds"
              />
              <button 
                onClick={handleAdd} 
                disabled={todo.trim().length <= 3} 
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 px-5 py-3 rounded-2xl text-sm font-bold text-white transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-rose-600/20 shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Filter & Divider */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Task List</span>
            
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
              <input 
                id="show" 
                onChange={toggleFinished} 
                type="checkbox" 
                checked={showFinished} 
                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
              /> 
              <span>Show Finished</span>
            </label>
          </div>

          {/* Task List Container */}
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {todos.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-slate-400 text-sm font-medium">No tasks yet. Create one above!</p>
              </div>
            )}

            {todos.map(item => {
              const formattedTime = formatTime(item.targetTime);

              return (showFinished || !item.isCompleted) && (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    item.isCompleted 
                      ? "bg-slate-50/70 border-slate-200/60 text-slate-400" 
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs"
                  }`}
                >
                  {/* Left: Checkbox and title */}
                  <div className="flex items-center gap-3 min-w-0 pr-3"> 
                    <input 
                      name={item.id} 
                      onChange={handleCheckbox} 
                      type="checkbox" 
                      checked={item.isCompleted} 
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 accent-rose-600 cursor-pointer shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm break-all ${item.isCompleted ? "line-through text-slate-400 font-normal" : "font-semibold text-slate-800"}`}>
                        {item.todo}
                      </span>
                      
                      {/* Timer Display Badge */}
                      {formattedTime && !item.isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-0.5">
                          <HiOutlineClock className="w-3 h-3" />
                          <span>{formattedTime} remaining</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={(e) => handleEdit(e, item.id)} 
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit task"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, item.id)} 
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <AiFillDelete className="w-3.5 h-3.5" />
                    </button>
                  </div> 
                </div>
              )
            })}
          </div>

        </div>
      </main>
    </div>
  )
}

export default App