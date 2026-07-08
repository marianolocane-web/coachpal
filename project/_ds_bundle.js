/* @ds-bundle: {"format":4,"namespace":"CoachPalDesignSystem_c83b94","components":[{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"DayMoodRing","sourcePath":"components/habit/DayMoodRing.jsx"},{"name":"HabitCard","sourcePath":"components/habit/HabitCard.jsx"},{"name":"HabitCheckButton","sourcePath":"components/habit/HabitCheckButton.jsx"},{"name":"HabitRow","sourcePath":"components/habit/HabitRow.jsx"},{"name":"IdentityVoteBar","sourcePath":"components/habit/IdentityVoteBar.jsx"},{"name":"ProgressRing","sourcePath":"components/habit/ProgressRing.jsx"},{"name":"StreakBadge","sourcePath":"components/habit/StreakBadge.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"Tabs","sourcePath":"components/surfaces/Tabs.jsx"}],"sourceHashes":{"components/feedback/Badge.jsx":"d9dda3aa877c","components/feedback/Toast.jsx":"7df0724b8602","components/feedback/Tooltip.jsx":"c8b9176300ab","components/forms/Button.jsx":"417b97c1a414","components/forms/Checkbox.jsx":"f2450efe1443","components/forms/IconButton.jsx":"1784beb7e624","components/forms/Input.jsx":"d015b149bacf","components/forms/Select.jsx":"124176eb8854","components/forms/Switch.jsx":"979be3c74fc0","components/habit/DayMoodRing.jsx":"a0ac38bf2bd4","components/habit/HabitCard.jsx":"749f52a64f4d","components/habit/HabitCheckButton.jsx":"74dd7134e7c6","components/habit/HabitRow.jsx":"8fe799f701e8","components/habit/IdentityVoteBar.jsx":"8ee5f95c177c","components/habit/ProgressRing.jsx":"cbe706ba12dc","components/habit/StreakBadge.jsx":"616412b6ad6c","components/surfaces/Card.jsx":"b74921394b1e","components/surfaces/Dialog.jsx":"d20c5c612072","components/surfaces/Tabs.jsx":"3020097bea46","ui_kits/coachpal-app/AddEditHabitScreen.jsx":"616b9cabc56f","ui_kits/coachpal-app/CalendarScreen.jsx":"d4ae5f2dc965","ui_kits/coachpal-app/DayDetailScreen.jsx":"105a4fd56707","ui_kits/coachpal-app/GeneralStatsScreen.jsx":"89e7486c3d9b","ui_kits/coachpal-app/HabitCharts.jsx":"12bf462b773b","ui_kits/coachpal-app/HabitDetailScreen.jsx":"f106e4556681","ui_kits/coachpal-app/HabitsListScreen.jsx":"90fe3ce14486","ui_kits/coachpal-app/HomeScreen.jsx":"82947005c5d3","ui_kits/coachpal-app/OnboardingScreen.jsx":"9e2837045b3c","ui_kits/coachpal-app/ProfileScreen.jsx":"206899de12ad","ui_kits/coachpal-app/StatsScreen.jsx":"f6c473a7439d","ui_kits/coachpal-app/TabBar.jsx":"b00192891619"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CoachPalDesignSystem_c83b94 = window.CoachPalDesignSystem_c83b94 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Badge.jsx
try { (() => {
const variants = {
  neutral: {
    background: 'var(--color-bg-surface-2)',
    color: 'var(--color-text-secondary)'
  },
  brand: {
    background: 'var(--color-brand-subtle)',
    color: 'var(--green-700)'
  },
  accent: {
    background: 'var(--color-accent-subtle)',
    color: 'var(--amber-700)'
  },
  danger: {
    background: 'var(--color-danger-subtle)',
    color: 'var(--coral-700)'
  }
};
function Badge({
  children,
  variant = 'neutral',
  icon = null
}) {
  const v = variants[variant] || variants.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      font: 'var(--text-label-sm)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-body)',
      ...v
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const {
  useEffect
} = React;
const variants = {
  success: {
    background: 'var(--green-600)',
    color: 'white'
  },
  info: {
    background: 'var(--sand-800)',
    color: 'white'
  },
  danger: {
    background: 'var(--coral-600)',
    color: 'white'
  }
};
function Toast({
  message,
  variant = 'success',
  onDismiss,
  autoHideMs = 3000
}) {
  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => onDismiss?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onDismiss]);
  const v = variants[variant] || variants.success;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      font: 'var(--text-body-sm)',
      fontFamily: 'var(--font-body)',
      ...v
    }
  }, message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  children,
  label,
  side = 'top'
}) {
  const [show, setShow] = useState(false);
  const posStyles = {
    top: {
      bottom: '120%',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: '120%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...posStyles[side],
      background: 'var(--sand-900)',
      color: 'white',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--text-caption)',
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 20
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const sizeStyles = {
  md: {
    padding: '10px 18px',
    font: 'var(--text-body-md)',
    gap: 8
  },
  sm: {
    padding: '7px 14px',
    font: 'var(--text-body-sm)',
    gap: 6
  },
  lg: {
    padding: '14px 22px',
    font: 'var(--text-title-sm)',
    gap: 8
  }
};
const variantStyles = {
  primary: {
    background: 'var(--color-brand)',
    color: 'var(--color-text-on-brand)',
    border: '1px solid transparent'
  },
  accent: {
    background: 'var(--color-accent)',
    color: 'var(--sand-900)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'var(--color-bg-surface-2)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-brand)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--color-danger-subtle)',
    color: 'var(--color-danger)',
    border: '1px solid transparent'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  fullWidth = false,
  onClick,
  type = 'button'
}) {
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      font: s.font,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.45 : 1,
      transition: 'transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
      ...v
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange?.(!checked),
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      border: `1.5px solid ${checked ? 'var(--color-brand)' : 'var(--color-border-strong)'}`,
      background: checked ? 'var(--color-brand)' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--duration-fast) var(--ease-standard)',
      flexShrink: 0
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "10",
    viewBox: "0 0 13 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 5L4.5 8.5L12 1",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--color-text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  size = 'md',
  variant = 'secondary',
  label,
  onClick
}) {
  const dims = {
    sm: 32,
    md: 40,
    lg: 48
  }[size] || 40;
  const variants = {
    secondary: {
      background: 'var(--color-bg-surface-2)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border-default)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      border: '1px solid transparent'
    },
    brand: {
      background: 'var(--color-brand-subtle)',
      color: 'var(--color-brand)',
      border: '1px solid transparent'
    }
  };
  const v = variants[variant] || variants.secondary;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    style: {
      width: dims,
      height: dims,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform var(--duration-fast) var(--ease-standard)',
      ...v
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.9)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  type = 'text'
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--color-bg-surface)',
      border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border-default)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px'
    }
  }, icon, /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--text-body-md)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)',
      width: '100%'
    }
  })), error && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-danger)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState
} = React;
function Select({
  label,
  options,
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value) || options[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      position: 'relative'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      font: 'var(--text-body-md)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)',
      cursor: 'pointer'
    }
  }, current?.label, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-tertiary)'
    }
  }, open ? '▲' : '▼')), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 4,
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      zIndex: 10
    }
  }, options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    onClick: () => {
      onChange?.(o.value);
      setOpen(false);
    },
    style: {
      padding: '10px 14px',
      font: 'var(--text-body-md)',
      cursor: 'pointer',
      background: o.value === value ? 'var(--color-brand-subtle)' : 'transparent',
      color: o.value === value ? 'var(--color-brand)' : 'var(--color-text-primary)'
    }
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--color-text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange?.(!checked),
    style: {
      width: 44,
      height: 26,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--color-brand)' : 'var(--sand-300)',
      position: 'relative',
      flexShrink: 0,
      transition: 'background var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'white',
      boxShadow: 'var(--shadow-xs)',
      transition: 'left var(--duration-base) var(--ease-standard)'
    }
  })));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/habit/DayMoodRing.jsx
try { (() => {
const bandColor = pct => pct >= 0.8 ? 'var(--color-success)' : pct >= 0.5 ? 'var(--color-warning)' : 'var(--color-danger)';
function DayMoodRing({
  label,
  emoji,
  progress = 0,
  alert = false,
  onClick,
  size = 64
}) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  const color = bandColor(progress);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-sm)',
      color: alert ? 'var(--color-danger)' : 'var(--color-text-tertiary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "var(--sand-200)",
    strokeWidth: 5,
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: 5,
    fill: "none",
    strokeDasharray: circumference,
    strokeDashoffset: offset,
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      fontSize: size * 0.44
    }
  }, emoji || '✕')));
}
Object.assign(__ds_scope, { DayMoodRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/DayMoodRing.jsx", error: String((e && e.message) || e) }); }

// components/habit/HabitCheckButton.jsx
try { (() => {
function HabitCheckButton({
  done,
  onClick,
  size = 40
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-pressed": done,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: done ? 'none' : '2px solid var(--color-border-strong)',
      background: done ? 'var(--color-brand)' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'transform var(--duration-fast) var(--ease-out-back), background var(--duration-base) var(--ease-standard)'
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.88)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1.06)';
      setTimeout(() => {
        e.currentTarget.style.transform = 'scale(1)';
      }, 120);
    }
  }, done && /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "14",
    viewBox: "0 0 13 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 5L4.5 8.5L12 1",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { HabitCheckButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/HabitCheckButton.jsx", error: String((e && e.message) || e) }); }

// components/habit/HabitRow.jsx
try { (() => {
function HabitRow({
  habit,
  onToggle
}) {
  const {
    name,
    time,
    streak,
    done,
    color
  } = habit;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-2) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: color || 'var(--color-brand-subtle)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-sm)',
      color: 'var(--color-text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--color-text-tertiary)',
      marginTop: 2
    }
  }, time, " ", streak ? `· 🔥 ${streak} días` : '')), /*#__PURE__*/React.createElement(__ds_scope.HabitCheckButton, {
    done: done,
    onClick: () => onToggle?.(habit)
  }));
}
Object.assign(__ds_scope, { HabitRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/HabitRow.jsx", error: String((e && e.message) || e) }); }

// components/habit/IdentityVoteBar.jsx
try { (() => {
function IdentityVoteBar({
  negativeEmoji,
  positiveEmoji,
  votes = 0
}) {
  const color = votes > 0 ? 'var(--color-success)' : votes < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)';
  // map votes (-10..10 typical) to a 0-1 position, center = 0
  const clamped = Math.max(-10, Math.min(10, votes));
  const pct = (clamped + 10) / 20 * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, negativeEmoji), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'linear-gradient(90deg, var(--coral-300), var(--sand-200) 50%, var(--green-300))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: `${pct}%`,
      transform: 'translate(-50%, -50%)',
      minWidth: 26,
      height: 20,
      padding: '0 6px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-bg-surface)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: 'var(--text-label-sm)',
      color,
      border: '1px solid var(--color-border-subtle)'
    }
  }, votes > 0 ? `+${votes}` : votes)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, positiveEmoji));
}
Object.assign(__ds_scope, { IdentityVoteBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/IdentityVoteBar.jsx", error: String((e && e.message) || e) }); }

// components/habit/HabitCard.jsx
try { (() => {
function HabitCard({
  habit,
  onToggle,
  onComment,
  onOpen,
  readOnly = false
}) {
  const {
    name,
    streak,
    goalLabel,
    goalValue,
    unit,
    goalDate,
    time,
    identity,
    done,
    overdue,
    missed,
    comment
  } = habit;
  const isMissed = missed && !done;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: isMissed ? 'var(--color-danger-subtle)' : 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: isMissed ? '1px solid var(--coral-100)' : '1px solid transparent',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpen,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      textAlign: 'left',
      font: 'var(--text-title-sm)',
      fontFamily: 'var(--font-body)',
      color: isMissed ? 'var(--coral-700)' : overdue && !done ? 'var(--color-danger)' : 'var(--color-text-primary)',
      textDecoration: done ? 'line-through' : 'none'
    }
  }, name), streak > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-sm)',
      color: 'var(--amber-600)'
    }
  }, "+", streak), goalLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)'
    }
  }, "\xB7 ", goalLabel, " ", goalValue, unit ? ` ${unit}` : '', " ", goalDate ? `al ${goalDate}` : ''), isMissed && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-sm)',
      color: 'var(--coral-700)',
      background: 'var(--coral-100)',
      padding: '1px 8px',
      borderRadius: 'var(--radius-pill)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, "No completado")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 2
    }
  }, time)), /*#__PURE__*/React.createElement(__ds_scope.HabitCheckButton, {
    done: !!done,
    onClick: () => onToggle?.(habit),
    size: 36
  })), identity && /*#__PURE__*/React.createElement(__ds_scope.IdentityVoteBar, {
    negativeEmoji: identity.negativeEmoji,
    positiveEmoji: identity.positiveEmoji,
    votes: identity.votes
  }), readOnly ? comment && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 6,
      font: 'var(--text-caption)',
      color: 'var(--color-text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", null, comment)) : /*#__PURE__*/React.createElement("button", {
    onClick: () => onComment?.(habit),
    style: {
      alignSelf: 'flex-start',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: 0,
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      fontFamily: 'var(--font-body)'
    }
  }, "\uD83D\uDCAC Comentar"));
}
Object.assign(__ds_scope, { HabitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/HabitCard.jsx", error: String((e && e.message) || e) }); }

// components/habit/ProgressRing.jsx
try { (() => {
function ProgressRing({
  progress = 0,
  size = 64,
  strokeWidth = 6,
  color = 'var(--color-brand)',
  children
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "var(--sand-200)",
    strokeWidth: strokeWidth,
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: strokeWidth,
    fill: "none",
    strokeDasharray: circumference,
    strokeDashoffset: offset,
    strokeLinecap: "round",
    style: {
      transition: 'stroke-dashoffset var(--duration-slow) var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)'
    }
  }, children));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/habit/StreakBadge.jsx
try { (() => {
function StreakBadge({
  days = 0,
  size = 'md'
}) {
  const sizes = {
    sm: {
      font: 'var(--text-label-md)',
      pad: '4px 10px'
    },
    md: {
      font: 'var(--text-title-sm)',
      pad: '6px 14px'
    },
    lg: {
      font: 'var(--text-display-sm)',
      pad: '10px 18px'
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: s.pad,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-accent-subtle)',
      color: 'var(--amber-700)',
      font: s.font,
      fontFamily: 'var(--font-display)'
    }
  }, "\uD83D\uDD25 ", days);
}
Object.assign(__ds_scope, { StreakBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/habit/StreakBadge.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'var(--space-5)',
  onClick,
  selected = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: selected ? '1.5px solid var(--color-brand)' : '1px solid transparent',
      padding,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow var(--duration-base) var(--ease-standard)'
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  onClose,
  actions
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(36,31,25,0.4)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 100
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      padding: 'var(--space-6)',
      width: '100%',
      maxWidth: 'var(--mobile-max-width)',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: 'var(--sand-300)',
      margin: '0 auto var(--space-5)'
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-lg)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-3)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--color-text-secondary)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Tabs.jsx
try { (() => {
function Tabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--color-bg-surface-2)',
      padding: 4,
      borderRadius: 'var(--radius-pill)'
    }
  }, tabs.map(t => {
    const active = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => onChange?.(t.value),
      style: {
        flex: 1,
        padding: '8px 14px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        font: 'var(--text-label-md)',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        background: active ? 'var(--color-bg-surface)' : 'transparent',
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        boxShadow: active ? 'var(--shadow-xs)' : 'none',
        transition: 'all var(--duration-fast) var(--ease-standard)'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/AddEditHabitScreen.jsx
try { (() => {
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const RESPONSE_TYPES = [{
  value: 'boolean',
  label: 'Sí / No'
}, {
  value: 'number',
  label: 'Numérica'
}, {
  value: 'text',
  label: 'Texto libre'
}];
const DEFAULT_UNITS = [{
  value: 'kg',
  label: 'Kgs'
}, {
  value: 'reps',
  label: 'Repeticiones'
}, {
  value: 'min',
  label: 'Minutos'
}, {
  value: 'sleep',
  label: 'Sleep Score'
}];
const OTHER_UNIT_VALUE = '__other__';
const CHART_TYPES = ['Everest', 'Termómetro', 'Valor diario', 'Promedio semanal'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
function parseDDMMYYYY(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec((str || '').trim());
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = '20' + y;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return isNaN(date.getTime()) ? null : date;
}
function formatDDMMYYYY(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
function DatePickerField({
  label,
  value,
  onChange
}) {
  const {
    useState,
    useRef,
    useEffect
  } = React;
  const {
    IconButton
  } = window.CoachPalDesignSystem_c83b94;
  const [open, setOpen] = useState(false);
  const parsed = parseDDMMYYYY(value) || new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDocClick = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);
  const openPicker = () => {
    const d = parseDDMMYYYY(value) || new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setOpen(o => !o);
  };
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const selected = parseDDMMYYYY(value);
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const goMonth = delta => {
    let m = viewMonth + delta,
      y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };
  const pickDay = d => {
    const date = new Date(viewYear, viewMonth, d);
    onChange(formatDDMMYYYY(date));
    setOpen(false);
  };
  const yearOptions = [];
  for (let y = viewYear - 6; y <= viewYear + 6; y++) yearOptions.push(y);
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 8px 6px 14px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "DD/MM/AA",
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--text-body-md)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)',
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    label: "Elegir fecha",
    variant: "ghost",
    size: "sm",
    onClick: openPicker,
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\uD83D\uDCC5")
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: 6,
      zIndex: 60,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      padding: 'var(--space-4)',
      width: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Mes anterior",
    variant: "ghost",
    size: "sm",
    onClick: () => goMonth(-1),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\u2039")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)'
    }
  }, MONTH_NAMES[viewMonth]), /*#__PURE__*/React.createElement("select", {
    value: viewYear,
    onChange: e => setViewYear(Number(e.target.value)),
    style: {
      font: 'var(--text-label-sm)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)',
      background: 'var(--color-bg-surface-2)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      padding: '4px 6px',
      cursor: 'pointer'
    }
  }, yearOptions.map(y => /*#__PURE__*/React.createElement("option", {
    key: y,
    value: y
  }, y))), /*#__PURE__*/React.createElement(IconButton, {
    label: "Mes siguiente",
    variant: "ghost",
    size: "sm",
    onClick: () => goMonth(1),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\u203A")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4,
      marginBottom: 4
    }
  }, WEEKDAY_LETTERS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: 'center',
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4
    }
  }, cells.map((d, i) => {
    const isSelected = d && selected && selected.getDate() === d && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      disabled: !d,
      onClick: () => d && pickDay(d),
      style: {
        aspectRatio: '1',
        border: 'none',
        borderRadius: '50%',
        cursor: d ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
        font: 'var(--text-label-sm)',
        background: isSelected ? 'var(--color-brand)' : 'transparent',
        color: !d ? 'transparent' : isSelected ? 'white' : 'var(--color-text-primary)'
      }
    }, d || '');
  }))));
}
function UnitManagerModal({
  units,
  onClose,
  onChange
}) {
  const {
    useState
  } = React;
  const {
    Button,
    Input,
    IconButton
  } = window.CoachPalDesignSystem_c83b94;
  const [rows, setRows] = useState(units);
  const [editingIdx, setEditingIdx] = useState(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const startEdit = i => {
    setEditingIdx(i);
    setDraftLabel(rows[i].label);
  };
  const saveEdit = () => {
    if (!draftLabel.trim()) return;
    setRows(rs => rs.map((r, i) => i === editingIdx ? {
      ...r,
      label: draftLabel.trim()
    } : r));
    setEditingIdx(null);
  };
  const remove = i => setRows(rs => rs.filter((_, idx) => idx !== i));
  const addUnit = () => {
    if (!newLabel.trim()) return;
    const value = 'custom_' + Date.now();
    setRows(rs => [...rs, {
      value,
      label: newLabel.trim()
    }]);
    setNewLabel('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--color-bg-app)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      borderBottom: '1px solid var(--color-border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Cerrar",
    variant: "ghost",
    onClick: () => onClose(null),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "\u2715")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, "Unidades de medida")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, rows.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: u.value,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-3) var(--space-4)'
    }
  }, editingIdx === i ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: draftLabel,
    onChange: e => setDraftLabel(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: saveEdit
  }, "Guardar"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setEditingIdx(null)
  }, "Cancelar")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-body-md)',
      color: 'var(--color-text-primary)'
    }
  }, u.label), /*#__PURE__*/React.createElement(IconButton, {
    label: "Editar",
    variant: "ghost",
    size: "sm",
    onClick: () => startEdit(i),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, "\u270E")
  }), /*#__PURE__*/React.createElement(IconButton, {
    label: "Eliminar",
    variant: "ghost",
    size: "sm",
    onClick: () => remove(i),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, "\uD83D\uDDD1")
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Nueva unidad \u2014 ej. Vasos de agua",
    value: newLabel,
    onChange: e => setNewLabel(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: addUnit
  }, "A\xF1adir"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => onChange(rows)
  }, "Guardar cambios")));
}
function AddEditHabitScreen({
  habit,
  onBack,
  onSave,
  onDelete,
  onDuplicate
}) {
  const {
    useState
  } = React;
  const {
    Input,
    Select,
    Checkbox,
    Button,
    IconButton,
    Badge
  } = window.CoachPalDesignSystem_c83b94;
  const isEdit = !!habit;
  const [name, setName] = useState(habit?.name || '');
  const [tagsText, setTagsText] = useState((habit?.tags || []).join(', '));
  const [description, setDescription] = useState(habit?.description || '');
  const [question, setQuestion] = useState(habit?.question || '¿Lo cumpliste hoy?');
  const [responseType, setResponseType] = useState(habit?.responseType || 'boolean');
  const [cueVisual, setCueVisual] = useState(habit?.cueVisual || '');
  const [negativeEmoji, setNegativeEmoji] = useState(habit?.identity?.negativeEmoji || '');
  const [negativeLabel, setNegativeLabel] = useState(habit?.identity?.negativeLabel || '');
  const [positiveEmoji, setPositiveEmoji] = useState(habit?.identity?.positiveEmoji || '');
  const [positiveLabel, setPositiveLabel] = useState(habit?.identity?.positiveLabel || '');
  const [contextTodo, setContextTodo] = useState(habit?.contextTodo || '');
  const [goalLabel, setGoalLabel] = useState(habit?.goalLabel || '');
  const [goalValue, setGoalValue] = useState(habit?.goalValue || '');
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [unit, setUnit] = useState(habit?.unit || 'min');
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [goalDate, setGoalDate] = useState(habit?.goalDate || '');
  const [charts, setCharts] = useState(habit?.charts || ['Valor diario']);
  const [days, setDays] = useState(habit?.days || [0, 1, 2, 3, 4]);
  const [time, setTime] = useState(habit?.time || '08:00');
  const [status, setStatus] = useState(habit?.status || 'Activo');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleDay = i => setDays(ds => ds.includes(i) ? ds.filter(d => d !== i) : [...ds, i]);
  const toggleChart = c => setCharts(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);
  const buildHabit = () => ({
    ...habit,
    name,
    description,
    question,
    responseType,
    cueVisual,
    contextTodo,
    tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
    identity: negativeEmoji || positiveEmoji ? {
      negativeEmoji,
      negativeLabel,
      positiveEmoji,
      positiveLabel,
      votes: habit?.identity?.votes || 0
    } : null,
    goalLabel,
    goalValue,
    unit,
    goalDate,
    charts,
    days,
    time,
    status
  });
  const sectionTitle = t => /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      margin: 'var(--space-2) 0'
    }
  }, t);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Cerrar",
    variant: "ghost",
    onClick: onBack,
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "\u2715")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, isEdit ? 'Editar hábito' : 'Nuevo hábito'), isEdit && /*#__PURE__*/React.createElement(IconButton, {
    label: "Duplicar",
    variant: "ghost",
    onClick: () => onDuplicate?.(buildHabit()),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\u29C9")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre",
    placeholder: "Ej. Meditar 10 min",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Etiquetas (separadas por coma)",
    placeholder: "Ej. Salud, Ma\xF1ana",
    value: tagsText,
    onChange: e => setTagsText(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Descripci\xF3n",
    placeholder: "\xBFEn qu\xE9 consiste este h\xE1bito?",
    value: description,
    onChange: e => setDescription(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Pregunta validadora",
    placeholder: "Ej. \xBFDormiste 7hs?",
    value: question,
    onChange: e => setQuestion(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Tipo de respuesta",
    value: responseType,
    onChange: setResponseType,
    options: RESPONSE_TYPES
  }), sectionTitle('Fórmula James Clear'), /*#__PURE__*/React.createElement(Input, {
    label: "Elemento visual (se\xF1al)",
    placeholder: "Ej. Ver el auto \u2192 10 sentadillas",
    value: cueVisual,
    onChange: e => setCueVisual(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "No elijo ser",
    placeholder: "\uD83E\uDD2F",
    value: negativeEmoji,
    onChange: e => setNegativeEmoji(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Descripci\xF3n",
    placeholder: "Burnout",
    value: negativeLabel,
    onChange: e => setNegativeLabel(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Elijo ser",
    placeholder: "\uD83E\uDDD8\u200D\u2642\uFE0F",
    value: positiveEmoji,
    onChange: e => setPositiveEmoji(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Descripci\xF3n",
    placeholder: "Paz mental",
    value: positiveLabel,
    onChange: e => setPositiveLabel(e.target.value)
  }))), /*#__PURE__*/React.createElement(Input, {
    label: "Contexto (to-do previo)",
    placeholder: "Ej. Dejar la ropa de deporte lista",
    value: contextTodo,
    onChange: e => setContextTodo(e.target.value)
  }), sectionTitle('Meta'), /*#__PURE__*/React.createElement(Input, {
    label: "Objetivo",
    placeholder: "Ej. Pesar",
    value: goalLabel,
    onChange: e => setGoalLabel(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Valor",
    placeholder: "90",
    value: goalValue,
    onChange: e => setGoalValue(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Unidad",
    value: unit,
    onChange: v => {
      if (v === OTHER_UNIT_VALUE) setUnitModalOpen(true);else setUnit(v);
    },
    options: [...units, {
      value: OTHER_UNIT_VALUE,
      label: 'Otra unidad de medida…'
    }]
  }))), /*#__PURE__*/React.createElement(DatePickerField, {
    label: "Fecha l\xEDmite",
    value: goalDate,
    onChange: setGoalDate
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)',
      marginBottom: 8
    }
  }, "Tipo de gr\xE1fico"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, CHART_TYPES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => toggleChart(c),
    style: {
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-sm)',
      fontFamily: 'var(--font-body)',
      background: charts.includes(c) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
      color: charts.includes(c) ? 'white' : 'var(--color-text-secondary)'
    }
  }, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)',
      marginBottom: 8
    }
  }, "D\xEDas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => toggleDay(i),
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      font: 'var(--text-label-md)',
      background: days.includes(i) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
      color: days.includes(i) ? 'white' : 'var(--color-text-secondary)'
    }
  }, d)))), /*#__PURE__*/React.createElement(Input, {
    label: "Horario",
    placeholder: "08:00",
    value: time,
    onChange: e => setTime(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Estado",
    value: status,
    onChange: setStatus,
    options: [{
      value: 'Activo',
      label: 'Activo'
    }, {
      value: 'Pausado',
      label: 'Pausado'
    }]
  }), isEdit && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, !confirmDelete ? /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    fullWidth: true,
    onClick: () => setConfirmDelete(true)
  }, "Eliminar h\xE1bito") : /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-danger-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--coral-700)'
    }
  }, "\xBFSeguro que quieres eliminar este h\xE1bito? No se puede deshacer."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => setConfirmDelete(false)
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    fullWidth: true,
    onClick: () => onDelete?.(habit)
  }, "S\xED, eliminar"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => onSave(buildHabit())
  }, isEdit ? 'Guardar cambios' : 'Crear hábito')), unitModalOpen && /*#__PURE__*/React.createElement(UnitManagerModal, {
    units: units,
    onClose: () => setUnitModalOpen(false),
    onChange: newUnits => {
      setUnits(newUnits);
      if (!newUnits.some(u => u.value === unit)) {
        setUnit(newUnits[newUnits.length - 1]?.value || '');
      }
      setUnitModalOpen(false);
    }
  }));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/AddEditHabitScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/CalendarScreen.jsx
try { (() => {
function MultiFilterDropdown({
  label,
  options,
  selected,
  onChange
}) {
  const {
    useState
  } = React;
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === 0;
  const summary = allSelected ? label : selected.length === 1 ? selected[0] : `${selected.length} seleccionados`;
  const toggle = opt => {
    if (selected.includes(opt)) onChange(selected.filter(o => o !== opt));else onChange([...selected, opt]);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      font: 'var(--text-caption)',
      color: allSelected ? 'var(--color-text-tertiary)' : 'var(--color-brand)',
      padding: '4px 10px',
      background: allSelected ? 'var(--color-bg-surface-2)' : 'var(--color-brand-subtle)',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, summary, " \u25BE"), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      zIndex: 30,
      minWidth: 180,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--color-border-subtle)',
      padding: 'var(--space-2)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onChange([]);
      setOpen(false);
    },
    style: {
      textAlign: 'left',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--text-body-sm)',
      color: allSelected ? 'var(--color-brand)' : 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)'
    }
  }, allSelected ? '✓ ' : '', label), options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    onClick: () => toggle(opt),
    style: {
      textAlign: 'left',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--text-body-sm)',
      color: selected.includes(opt) ? 'var(--color-brand)' : 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)'
    }
  }, selected.includes(opt) ? '✓ ' : '', opt))));
}
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
function CalendarScreen({
  habits = [],
  onBack,
  onOpenDay
}) {
  const {
    useState
  } = React;
  const {
    DayMoodRing
  } = window.CoachPalDesignSystem_c83b94;
  const today = new Date(2026, 6, 5); // Jul 5, 2026 — app "now"
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthIdx);
  const [habitFilter, setHabitFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const habitNames = habits.filter(h => h.status !== 'Eliminado').map(h => h.name);
  const allTags = [...new Set(habits.filter(h => h.status !== 'Eliminado').flatMap(h => h.tags || []))];
  const days = Array.from({
    length: 31
  }, (_, i) => {
    const seed = i * 37 % 100;
    return {
      n: i + 1,
      emoji: seed > 70 ? '🤩' : seed > 45 ? '😊' : seed > 25 ? '😐' : seed > 10 ? '😢' : null,
      progress: seed % 100 / 100
    };
  });
  // pad to start on correct weekday (assume month starts on Wed for demo)
  const leadingBlanks = 2;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-bg-surface)',
      cursor: 'pointer',
      fontSize: 16
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, "Vista calendario")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '0 var(--space-5) var(--space-3)',
      justifyContent: 'center'
    }
  }, years.map(y => /*#__PURE__*/React.createElement("button", {
    key: y,
    onClick: () => setYear(y),
    style: {
      padding: '6px 16px',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-md)',
      fontFamily: 'var(--font-body)',
      background: y === year ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
      color: y === year ? 'white' : 'var(--color-text-secondary)'
    }
  }, y))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 6,
      padding: '0 var(--space-5) var(--space-3)'
    }
  }, MONTHS.map((m, i) => {
    const isFuture = year > currentYear || year === currentYear && i > currentMonthIdx;
    const isSelected = i === month && !isFuture;
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      disabled: isFuture,
      onClick: () => setMonth(i),
      style: {
        padding: '8px 0',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: isFuture ? 'not-allowed' : 'pointer',
        font: 'var(--text-label-sm)',
        fontFamily: 'var(--font-body)',
        background: isSelected ? 'var(--sand-900)' : 'var(--color-bg-surface-2)',
        color: isFuture ? 'var(--sand-400)' : isSelected ? 'white' : 'var(--color-text-secondary)',
        opacity: isFuture ? 0.6 : 1
      }
    }, m);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-4) var(--space-3)',
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MultiFilterDropdown, {
    label: "Todos los h\xE1bitos",
    options: habitNames,
    selected: habitFilter,
    onChange: setHabitFilter
  }), /*#__PURE__*/React.createElement(MultiFilterDropdown, {
    label: "Todas las etiquetas",
    options: allTags,
    selected: tagFilter,
    onChange: setTagFilter
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      padding: '0 var(--space-2)'
    }
  }, WEEKDAYS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      textAlign: 'center',
      font: 'var(--text-label-sm)',
      color: 'var(--color-text-tertiary)',
      padding: '4px 0'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '0 var(--space-2) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2
    }
  }, Array.from({
    length: leadingBlanks
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: 'b' + i
  })), days.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.n,
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(DayMoodRing, {
    label: String(d.n),
    emoji: d.emoji,
    progress: d.progress,
    size: 34,
    onClick: () => onOpenDay({
      date: `${d.n} ${MONTHS[month]}`,
      emoji: d.emoji,
      progress: d.progress
    })
  }))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/CalendarScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/DayDetailScreen.jsx
try { (() => {
function DayDetailScreen({
  day,
  onBack
}) {
  const {
    HabitCard
  } = window.CoachPalDesignSystem_c83b94;
  const pct = Math.round((day?.progress || 0) * 100);
  const moods = ['feliz', 'ansioso', 'sorprendido'];
  const dayHabits = [{
    id: 1,
    name: 'Meditar 10 min',
    streak: 12,
    time: '08:00',
    done: true,
    comment: 'Muy relajante hoy.',
    identity: {
      negativeEmoji: '🤯',
      positiveEmoji: '🧘‍♂️',
      votes: 7
    }
  }, {
    id: 2,
    name: 'Leer 20 páginas',
    streak: 3,
    time: '21:00',
    done: false,
    missed: true,
    identity: {
      negativeEmoji: '📵',
      positiveEmoji: '📚',
      votes: 2
    }
  }, {
    id: 3,
    name: 'Beber 2L de agua',
    streak: 0,
    time: 'Todo el día',
    done: false,
    missed: true,
    comment: 'Se me pasó, muy ocupada.',
    identity: {
      negativeEmoji: '🥤',
      positiveEmoji: '💧',
      votes: -1
    }
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-bg-surface)',
      cursor: 'pointer',
      fontSize: 16
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, day?.date || 'Hoy'), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)'
    }
  }, day?.emoji || '✕', " \xB7 ", pct, "% completado"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginBottom: 6
    }
  }, "Qu\xE9 afect\xF3 mi \xE1nimo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, moods.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-bg-surface-2)',
      font: 'var(--text-label-sm)',
      color: 'var(--color-text-secondary)'
    }
  }, m)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginBottom: 6
    }
  }, "H\xE1bitos de ese d\xEDa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, dayHabits.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id
  }, /*#__PURE__*/React.createElement(HabitCard, {
    habit: h,
    readOnly: true
  })))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/DayDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/GeneralStatsScreen.jsx
try { (() => {
function GeneralStatsScreen({
  habits,
  onBack,
  onOpenHabit
}) {
  const {
    useState
  } = React;
  const {
    Tabs
  } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');
  const days = {
    week: 7,
    month: 30,
    year: 90
  }[range];
  const dayLabels = Array.from({
    length: days
  }, (_, i) => i + 1);
  const heatmap = habits.map(h => ({
    name: h.name,
    cells: seededDaily(h.id, days).map((v, i) => (h.id * 13 + i * 7) % 10 < 1 ? 'n/a' : v ? 'done' : 'missed')
  }));

  // Aggregate completion rate + longest streak across all habits
  const completionRate = Math.round(heatmap.reduce((sum, row) => sum + row.cells.filter(c => c === 'done').length, 0) / Math.max(1, heatmap.reduce((sum, row) => sum + row.cells.filter(c => c !== 'n/a').length, 0)) * 100);
  const longestStreak = Math.max(0, ...habits.map(h => h.streak || 0)) + 15;

  // Weekly trend (aggregate completion % per week) across the selected range
  const weeks = range === 'year' ? 12 : Math.ceil(days / 7);
  const weeklyTrend = Array.from({
    length: weeks
  }, (_, w) => {
    let done = 0,
      total = 0;
    habits.forEach(h => {
      const week = seededDaily(h.id, 7, w * 7);
      done += week.reduce((a, b) => a + b, 0);
      total += week.length;
    });
    return total ? done / total : 0;
  });

  // By-tag completion (real, from habit tags)
  const tagStats = {};
  habits.forEach((h, hi) => {
    (h.tags || []).forEach(t => {
      if (!tagStats[t]) tagStats[t] = {
        done: 0,
        total: 0
      };
      const daily = seededDaily(h.id, days);
      tagStats[t].done += daily.reduce((a, b) => a + b, 0);
      tagStats[t].total += daily.length;
    });
  });
  const tags = Object.keys(tagStats);
  const everestHabits = habits.filter(h => (h.charts || []).includes('Everest'));
  const thermoHabits = habits.filter(h => (h.charts || []).includes('Termómetro'));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-bg-surface)',
      cursor: 'pointer',
      fontSize: 16
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, "Estad\xEDsticas generales")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: range,
    onChange: setRange,
    tabs: [{
      value: 'week',
      label: 'Semana'
    }, {
      value: 'month',
      label: 'Mes'
    }, {
      value: 'year',
      label: 'Año'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-brand)',
      fontFamily: 'var(--font-display)'
    }
  }, completionRate, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, "Tasa de cumplimiento")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--amber-600)',
      fontFamily: 'var(--font-display)'
    }
  }, longestStreak), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, "Racha m\xE1s larga"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Heatmap"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `100px repeat(${days}, 14px)`,
      gap: 3,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null), dayLabels.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      font: '8px var(--font-body)',
      color: 'var(--color-text-tertiary)',
      textAlign: 'center',
      writingMode: 'vertical-rl'
    }
  }, d)), heatmap.map(row => /*#__PURE__*/React.createElement(React.Fragment, {
    key: row.name
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, row.name), row.cells.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: c === 'done' ? 'var(--color-success)' : c === 'missed' ? 'var(--color-danger)' : 'var(--sand-200)'
    }
  }))))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Tendencia \u2014 cumplimiento semanal"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(WeeklyTrendChart, {
    data: weeklyTrend
  }))), tags.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Por etiqueta"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, tags.map(t => {
    const pct = tagStats[t].total ? Math.round(tagStats[t].done / tagStats[t].total * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        flex: '1 1 30%',
        minWidth: 90,
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-4)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        margin: '0 auto',
        background: `conic-gradient(var(--color-brand) ${pct}%, var(--sand-200) 0)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--color-text-secondary)',
        marginTop: 8
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-label-sm)',
        color: 'var(--color-text-tertiary)'
      }
    }, pct, "%"));
  }))), everestHabits.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Metas (Everest)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, everestHabits.map(h => /*#__PURE__*/React.createElement("button", {
    key: h.id,
    onClick: () => onOpenHabit(h),
    style: {
      textAlign: 'left',
      border: 'none',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      marginBottom: 6
    }
  }, h.icon, " ", h.name), /*#__PURE__*/React.createElement(EverestChart, {
    habitId: h.id,
    goal: h.streakGoal || 21,
    rangeDays: Math.min(days, 30)
  }))))), thermoHabits.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Metas diarias"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, thermoHabits.map(h => /*#__PURE__*/React.createElement("button", {
    key: h.id,
    onClick: () => onOpenHabit(h),
    style: {
      textAlign: 'left',
      border: 'none',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      marginBottom: 10
    }
  }, h.icon, " ", h.name), /*#__PURE__*/React.createElement(ThermometerChart, {
    current: parseFloat(h.goalCurrent ?? 0),
    goal: parseFloat(h.goalValue ?? 1),
    unit: h.unit ? ` ${h.unit}` : ''
  })))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/GeneralStatsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/HabitCharts.jsx
try { (() => {
// Chart components for HabitDetailScreen. Plain React, inline SVG, no external libs.

function computeStreakSeries(daily) {
  let streak = 0;
  return daily.map(v => {
    if (v === 1) {
      streak = streak < 0 ? 1 : streak + 1;
    } else {
      streak = streak > 0 ? 0 : streak - 1;
    }
    return streak;
  });
}
function seededDaily(seed, n, offset = 0) {
  return Array.from({
    length: n
  }, (_, i) => {
    let h = seed * 2654435761 + (i + offset) * 40503 >>> 0;
    h = (h ^ h >>> 15) >>> 0;
    return h % 100 < 30 + seed * 17 % 55 ? 1 : 0;
  });
}
function EverestChart({
  habitId,
  goal = 21,
  rangeDays = 14
}) {
  const {
    useState,
    useRef,
    useEffect
  } = React;
  const [hover, setHover] = useState(null);
  const [drawn, setDrawn] = useState(false);
  const pathRef = useRef(null);
  const daily = seededDaily(habitId, rangeDays);
  const series = computeStreakSeries(daily);
  const W = 320,
    H = 200,
    padL = 28,
    padR = 12,
    padT = 28,
    padB = 24;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const yMin = Math.min(-3, Math.min(...series) - 1);
  const yMax = Math.max(goal + 1, Math.max(...series) + 1);
  const x = i => padL + i / (series.length - 1) * plotW;
  const y = v => padT + plotH - (v - yMin) / (yMax - yMin) * plotH;
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, []);
  const pathLen = plotW * 1.4; // approximation, good enough for a stroke reveal

  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      textAlign: 'center',
      marginBottom: 8
    }
  }, "Escalando el Everest de tu H\xE1bito"), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      overflow: 'visible'
    }
  }, Array.from({
    length: 5
  }, (_, i) => yMin + i * (yMax - yMin) / 4).map((gv, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: padL,
    x2: W - padR,
    y1: y(gv),
    y2: y(gv),
    stroke: "var(--color-border-subtle)",
    strokeWidth: "1",
    opacity: "0.5"
  })), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: y(0),
    y2: y(0),
    stroke: "var(--color-text-tertiary)",
    strokeWidth: "1",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: y(goal),
    y2: y(goal),
    stroke: "var(--amber-600)",
    strokeWidth: "1.5",
    strokeDasharray: "4 3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W - padR,
    cy: y(goal),
    r: "3.5",
    fill: "var(--amber-600)"
  }), /*#__PURE__*/React.createElement("text", {
    x: W - padR - 4,
    y: y(goal) - 6,
    textAnchor: "end",
    style: {
      font: '9px var(--font-body)',
      fill: 'var(--amber-600)'
    }
  }, "Meta: ", goal, " d\xEDas"), series.map((v, i) => {
    if (i === 0) return null;
    const color = daily[i] === 1 ? 'var(--color-success)' : 'var(--color-danger)';
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x(i - 1),
      y1: y(series[i - 1]),
      x2: x(i),
      y2: y(v),
      stroke: color,
      strokeWidth: "2.5",
      strokeLinecap: "round",
      style: {
        strokeDasharray: pathLen,
        strokeDashoffset: drawn ? 0 : pathLen,
        transition: `stroke-dashoffset 1.1s ease ${i * 0.01}s`
      }
    });
  }), series.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(v),
    r: hover === i ? 5 : 3.5,
    fill: daily[i] === 1 ? 'var(--color-success)' : 'var(--color-danger)',
    stroke: "var(--color-bg-surface)",
    strokeWidth: "1",
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("title", null, `Día ${i + 1} — Progreso: ${v} · ${daily[i] === 1 ? 'Cumplido' : 'No cumplido'}`))), series.map((_, i) => i % 2 === 0 ? /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 4,
    textAnchor: "middle",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, i + 1) : null)));
}
function ThermometerChart({
  current = 0,
  goal = 1,
  unit = ''
}) {
  const pct = goal > 0 ? Math.max(0, Math.min(1, current / goal)) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 140,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--sand-200)',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: `${pct * 100}%`,
      background: pct >= 1 ? 'var(--color-success)' : 'var(--color-brand)',
      transition: 'height var(--duration-slow) var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, current, unit, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--color-text-tertiary)'
    }
  }, "/ ", goal, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, Math.round(pct * 100), "% de tu meta diaria")));
}
function DailyValueChart({
  habitId,
  rangeDays = 7,
  unit = ''
}) {
  const raw = seededDaily(habitId, rangeDays).map((v, i) => v * (1 + (habitId + i) % 4));
  const max = Math.max(1, ...raw);
  const W = 320,
    H = 160,
    padL = 26,
    padR = 8,
    padT = 8,
    padB = 20;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const barW = plotW / raw.length * 0.6;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%'
    }
  }, [0, 0.5, 1].map((f, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: padT + plotH * (1 - f),
    y2: padT + plotH * (1 - f),
    stroke: "var(--color-border-subtle)",
    strokeWidth: "1",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 4,
    y: padT + plotH * (1 - f) + 3,
    textAnchor: "end",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, Math.round(max * f), unit))), raw.map((v, i) => {
    const bx = padL + (i + 0.2) * (plotW / raw.length);
    const bh = v / max * plotH;
    return /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: bx,
      y: padT + plotH - bh,
      width: barW,
      height: bh,
      rx: "3",
      fill: v > 0 ? 'var(--color-brand)' : 'var(--sand-200)'
    });
  }), raw.map((_, i) => i % Math.ceil(raw.length / 6) === 0 ? /*#__PURE__*/React.createElement("text", {
    key: i,
    x: padL + (i + 0.5) * (plotW / raw.length),
    y: H - 4,
    textAnchor: "middle",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, i + 1) : null));
}
function WeeklyTrendChart({
  data
}) {
  const W = 320,
    H = 140,
    padL = 30,
    padR = 12,
    padT = 12,
    padB = 20;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const x = i => padL + (data.length > 1 ? i / (data.length - 1) * plotW : plotW / 2);
  const y = v => padT + plotH - v * plotH;
  const dPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%'
    }
  }, [0, 0.5, 1].map((f, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: y(f),
    y2: y(f),
    stroke: "var(--color-border-subtle)",
    strokeWidth: "1",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 4,
    y: y(f) + 3,
    textAnchor: "end",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, Math.round(f * 100), "%"))), /*#__PURE__*/React.createElement("path", {
    d: dPath,
    fill: "none",
    stroke: "var(--color-brand)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), data.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(v),
    r: "3.5",
    fill: "var(--color-brand)"
  }, /*#__PURE__*/React.createElement("title", null, `Semana ${i + 1}: ${Math.round(v * 100)}%`))), data.map((_, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 4,
    textAnchor: "middle",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, "S", i + 1)));
}
function WeeklyAverageChart({
  habitId,
  points = 6
}) {
  const weeklyAvg = Array.from({
    length: points
  }, (_, i) => {
    const week = seededDaily(habitId, 7, i * 7);
    return week.reduce((a, b) => a + b, 0) / 7;
  });
  const W = 320,
    H = 130,
    padL = 12,
    padR = 12,
    padT = 12,
    padB = 20;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const x = i => padL + i / (weeklyAvg.length - 1) * plotW;
  const y = v => padT + plotH - v * plotH;
  const dPath = weeklyAvg.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: W - padR,
    y1: y(0),
    y2: y(0),
    stroke: "var(--color-border-subtle)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: dPath,
    fill: "none",
    stroke: "var(--color-brand)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), weeklyAvg.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(v),
    r: "3.5",
    fill: "var(--color-brand)"
  })), weeklyAvg.map((_, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 4,
    textAnchor: "middle",
    style: {
      font: '8px var(--font-body)',
      fill: 'var(--color-text-tertiary)'
    }
  }, "S", i + 1)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/HabitCharts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/HabitDetailScreen.jsx
try { (() => {
function HabitDetailScreen({
  habit,
  onBack,
  onEdit,
  onDelete
}) {
  const {
    useState
  } = React;
  const {
    StreakBadge,
    Tabs,
    IconButton,
    Dialog,
    Button,
    IdentityVoteBar
  } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!habit) return null;
  const rangeDays = {
    week: 7,
    month: 30,
    year: 30
  }[range];
  const hasGoal = !!(habit.goalLabel && habit.goalValue);
  const goalNum = hasGoal ? parseFloat(habit.goalValue) : null;
  const currentNum = hasGoal ? parseFloat(habit.goalCurrent ?? 0) : null;
  const goalPct = hasGoal && goalNum > 0 ? Math.max(0, Math.min(1, currentNum / goalNum)) : 0;
  const remaining = hasGoal ? Math.max(0, goalNum - currentNum) : 0;
  const charts = habit.charts || [];
  const week = Array.from({
    length: rangeDays
  }, (_, i) => ({
    label: rangeDays === 7 ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i] : String(i + 1),
    done: (habit.id * 13 + i * 7) % 10 >= 4 ? true : (habit.id * 13 + i * 7) % 10 >= 1 ? false : null
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Volver",
    variant: "ghost",
    onClick: onBack,
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "\u2190")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, habit.name), /*#__PURE__*/React.createElement(IconButton, {
    label: "Editar",
    variant: "ghost",
    onClick: onEdit,
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\u270E")
  }), /*#__PURE__*/React.createElement(IconButton, {
    label: "Eliminar",
    variant: "ghost",
    onClick: () => setConfirmOpen(true),
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\uD83D\uDDD1")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, habit.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--color-text-secondary)'
    }
  }, habit.category, " \xB7 ", habit.time), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(StreakBadge, {
    days: habit.streak
  })))), habit.identity && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4) var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(IdentityVoteBar, {
    negativeEmoji: habit.identity.negativeEmoji,
    positiveEmoji: habit.identity.positiveEmoji,
    votes: habit.identity.votes
  })), hasGoal && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--color-text-primary)'
    }
  }, remaining > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Faltan ", /*#__PURE__*/React.createElement("strong", null, remaining, habit.unit ? ` ${habit.unit}` : ''), " para tu meta de ", habit.goalValue, habit.unit ? ` ${habit.unit}` : '', habit.goalDate ? ` · ${habit.goalDate}` : '') : /*#__PURE__*/React.createElement(React.Fragment, null, "\uD83C\uDF89 Alcanzaste tu meta de ", habit.goalValue, habit.unit ? ` ${habit.unit}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 10,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--sand-200)',
      overflow: 'hidden',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${goalPct * 100}%`,
      background: goalPct >= 1 ? 'var(--color-success)' : 'var(--color-brand)',
      transition: 'width var(--duration-slow) var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, habit.goalCurrent, habit.unit ? ` ${habit.unit}` : '', " de ", habit.goalValue, habit.unit ? ` ${habit.unit}` : '')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tabs, {
    value: range,
    onChange: setRange,
    tabs: [{
      value: 'week',
      label: 'Semana'
    }, {
      value: 'month',
      label: 'Mes'
    }, {
      value: 'year',
      label: 'Año'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: range === 'week' ? 0 : 6,
      justifyContent: range === 'week' ? 'space-between' : 'flex-start'
    }
  }, week.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      width: range === 'week' ? 'auto' : 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: range === 'week' ? 32 : 18,
      height: range === 'week' ? 32 : 18,
      borderRadius: '50%',
      background: d.done === true ? 'var(--color-brand)' : d.done === false ? 'var(--color-danger-subtle)' : 'var(--sand-100)',
      border: d.done === null ? '1.5px dashed var(--sand-300)' : 'none'
    }
  }), range === 'week' && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-sm)',
      color: 'var(--color-text-tertiary)'
    }
  }, d.label))))), charts.includes('Everest') && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(EverestChart, {
    habitId: habit.id,
    goal: habit.streakGoal || 21,
    rangeDays: rangeDays
  })), charts.includes('Termómetro') && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-4)'
    }
  }, "Progreso de hoy"), /*#__PURE__*/React.createElement(ThermometerChart, {
    current: parseFloat(habit.goalCurrent ?? 0),
    goal: parseFloat(habit.goalValue ?? 1),
    unit: habit.unit ? ` ${habit.unit}` : ''
  })), charts.includes('Valor diario') && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-4)'
    }
  }, "Valor diario"), /*#__PURE__*/React.createElement(DailyValueChart, {
    habitId: habit.id,
    rangeDays: rangeDays,
    unit: habit.unit ? ` ${habit.unit}` : ''
  })), charts.includes('Promedio semanal') && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-4)'
    }
  }, "Tendencia \u2014 promedio semanal"), /*#__PURE__*/React.createElement(WeeklyAverageChart, {
    habitId: habit.id,
    points: range === 'year' ? 12 : 6
  })), (habit.commentHistory || []).length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 8
    }
  }, "Historial de comentarios"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, habit.commentHistory.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-3) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)'
    }
  }, c.date), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--color-text-primary)',
      marginTop: 2
    }
  }, c.text))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--color-text-secondary)'
    }
  }, "Racha m\xE1s larga: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--color-text-primary)'
    }
  }, habit.streak + 15, " d\xEDas"))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirmOpen,
    title: "\xBFEliminar h\xE1bito?",
    onClose: () => setConfirmOpen(false),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setConfirmOpen(false),
      fullWidth: true
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        setConfirmOpen(false);
        onDelete(habit);
      },
      fullWidth: true
    }, "Eliminar"))
  }, "Esta acci\xF3n no se puede deshacer."));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/HabitDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/HabitsListScreen.jsx
try { (() => {
function HabitsListScreen({
  habits,
  onBack,
  onOpenHabit,
  onOpenStats,
  onAddHabit
}) {
  const {
    useState
  } = React;
  const {
    Input,
    Badge
  } = window.CoachPalDesignSystem_c83b94;
  const [query, setQuery] = useState('');
  const filtered = habits.filter(h => h.name.toLowerCase().includes(query.toLowerCase()) || (h.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-bg-surface)',
      cursor: 'pointer',
      fontSize: 16
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-title-md)',
      color: 'var(--color-text-primary)'
    }
  }, "Todos los h\xE1bitos"), /*#__PURE__*/React.createElement("button", {
    onClick: onAddHabit,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--color-brand)',
      color: 'white',
      cursor: 'pointer',
      fontSize: 20
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-5) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Buscar por nombre o etiqueta\u2026",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, filtered.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenHabit(h),
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      textAlign: 'left',
      font: 'var(--text-title-sm)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)'
    }
  }, h.name), /*#__PURE__*/React.createElement(Badge, {
    variant: h.status === 'Pausado' ? 'neutral' : 'brand'
  }, h.status || 'Activo')), h.goalLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-secondary)',
      marginTop: 4
    }
  }, "\uD83C\uDFAF ", h.goalLabel, " ", h.goalValue, " \xB7 al ", h.goalDate), h.identity && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 2
    }
  }, h.identity.positiveEmoji, " vs ", h.identity.negativeEmoji), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, (h.tags || []).map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    variant: "neutral"
  }, t)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)'
    }
  }, h.time)), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenStats(h),
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-sm)',
      color: 'var(--color-brand)',
      fontFamily: 'var(--font-body)'
    }
  }, "\uD83D\uDCCA Stats"))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/HabitsListScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/HomeScreen.jsx
try { (() => {
function HomeScreen({
  habits,
  onToggle,
  onOpenHabit,
  onAddHabit,
  onOpenDay,
  dayHistory,
  quote,
  onOpenAllHabits,
  onOpenCalendar,
  onSaveComment
}) {
  const {
    useState
  } = React;
  const {
    HabitCard,
    DayMoodRing,
    IconButton,
    Dialog,
    Button
  } = window.CoachPalDesignSystem_c83b94;
  const doneCount = habits.filter(h => h.done).length;
  const pct = habits.length ? Math.round(doneCount / habits.length * 100) : 0;
  const [commentHabit, setCommentHabit] = useState(null);
  const [commentText, setCommentText] = useState('');
  const openComment = h => {
    setCommentHabit(h);
    setCommentText(h.comment || '');
  };
  const closeComment = () => setCommentHabit(null);
  const saveComment = () => {
    onSaveComment(commentHabit, commentText.trim());
    setCommentHabit(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) var(--space-5) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-text-primary)'
    }
  }, "Hola, Marta \uD83D\uDC4B")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-4) 0',
      padding: 'var(--space-4)',
      background: 'var(--color-brand-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--green-700)',
      fontStyle: 'italic'
    }
  }, "\u201C", quote, "\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '0 0 var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-sm)',
      color: 'var(--color-text-primary)'
    }
  }, "\xDAltimos 4 d\xEDas"), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCalendar,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-md)',
      color: 'var(--color-brand)',
      fontFamily: 'var(--font-body)'
    }
  }, "Ver m\xE1s")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-6)'
    }
  }, dayHistory.map(d => /*#__PURE__*/React.createElement(DayMoodRing, {
    key: d.label,
    label: d.label,
    emoji: d.emoji,
    progress: d.progress,
    alert: d.alert,
    onClick: () => onOpenDay(d),
    size: 60
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-sm)',
      color: 'var(--color-text-primary)'
    }
  }, "H\xE1bitos del d\xEDa"), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAllHabits,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-sm)',
      color: 'var(--color-text-tertiary)',
      fontFamily: 'var(--font-body)'
    }
  }, "Todos los H\xE1bitos")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-secondary)',
      marginBottom: 6
    }
  }, "H\xE1bitos para el d\xEDa 05/07"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 10,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--sand-200)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${pct}%`,
      background: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
      transition: 'width var(--duration-slow) var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, pct, "% de h\xE1bitos diarios completados")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, habits.map(h => /*#__PURE__*/React.createElement(HabitCard, {
    key: h.id,
    habit: h,
    onToggle: onToggle,
    onOpen: () => onOpenHabit(h),
    onComment: () => openComment(h)
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onAddHabit,
    style: {
      marginTop: 'var(--space-5)',
      width: '100%',
      padding: '14px',
      borderRadius: 'var(--radius-pill)',
      border: '1.5px dashed var(--color-border-strong)',
      background: 'none',
      cursor: 'pointer',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-body)'
    }
  }, "+ A\xF1adir h\xE1bito")), /*#__PURE__*/React.createElement(Dialog, {
    open: !!commentHabit,
    title: commentHabit ? `Comentario · ${commentHabit.name}` : '',
    onClose: closeComment,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: closeComment
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: saveComment
    }, "Guardar"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginBottom: 'var(--space-2)'
    }
  }, "Puedes editar este comentario mientras el d\xEDa siga en curso. Una vez finalizado, quedar\xE1 registrado y no podr\xE1 modificarse."), /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    value: commentText,
    onChange: e => setCommentText(e.target.value),
    placeholder: "Escribe tu comentario\u2026",
    rows: 4,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      resize: 'vertical',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      font: 'var(--text-body-md)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-primary)',
      background: 'var(--color-bg-surface)'
    }
  })));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/OnboardingScreen.jsx
try { (() => {
function OnboardingScreen({
  onFinish
}) {
  const {
    useState
  } = React;
  const [step, setStep] = useState(0);
  const steps = [{
    emoji: '👋',
    title: 'Hola, soy tu CoachPal',
    body: 'Te ayudo a construir hábitos que se quedan. Un día a la vez.'
  }, {
    emoji: '🔥',
    title: 'Las rachas importan',
    body: 'Cada día que marcas un hábito, tu racha crece. Nosotros la celebramos contigo.'
  }, {
    emoji: '🌱',
    title: 'Empieza pequeño',
    body: 'No hace falta hacerlo todo. Elige 1-3 hábitos para empezar hoy.'
  }];
  const s = steps[step];
  const last = step === steps.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)',
      padding: 'var(--space-5) var(--space-6) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44
    }
  }, s.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-text-primary)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--color-text-secondary)',
      maxWidth: 280
    }
  }, s.body)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 'var(--space-4)'
    }
  }, steps.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: i === step ? 20 : 7,
      height: 7,
      borderRadius: 'var(--radius-pill)',
      background: i === step ? 'var(--color-brand)' : 'var(--sand-300)',
      transition: 'all var(--duration-base) var(--ease-standard)'
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => last ? onFinish() : setStep(step + 1),
    style: {
      background: 'var(--color-brand)',
      color: 'white',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: '16px',
      font: 'var(--text-title-sm)',
      fontFamily: 'var(--font-body)',
      cursor: 'pointer'
    }
  }, last ? 'Empezar' : 'Siguiente'), !last && /*#__PURE__*/React.createElement("button", {
    onClick: onFinish,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--color-text-tertiary)',
      font: 'var(--text-body-sm)',
      marginTop: 12,
      cursor: 'pointer'
    }
  }, "Saltar"));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/OnboardingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/ProfileScreen.jsx
try { (() => {
function ProfileScreen({
  user,
  onBack
}) {
  const {
    StreakBadge,
    Switch,
    IconButton
  } = window.CoachPalDesignSystem_c83b94;
  const stats = [{
    label: 'Racha más larga',
    value: `${user.longestStreak} días`
  }, {
    label: 'Días completados',
    value: user.totalDays
  }, {
    label: 'Hábitos activos',
    value: user.habitsActive
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) var(--space-5) var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--color-brand)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: 'var(--text-title-lg)',
      fontFamily: 'var(--font-display)'
    }
  }, user.name[0]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-lg)',
      color: 'var(--color-text-primary)'
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(StreakBadge, {
    days: user.longestStreak,
    size: "sm"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-brand)',
      fontFamily: 'var(--font-display)'
    }
  }, s.value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, "Ajustes"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    label: "Recordatorios"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: false,
    label: "Modo oscuro"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    label: "Sonidos de celebraci\xF3n"
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/StatsScreen.jsx
try { (() => {
function StatsScreen({
  habits
}) {
  const {
    useState
  } = React;
  const {
    Tabs,
    StreakBadge,
    ProgressRing
  } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');
  const week = [{
    day: 'L',
    pct: 1
  }, {
    day: 'M',
    pct: 1
  }, {
    day: 'X',
    pct: 0.66
  }, {
    day: 'J',
    pct: 0.33
  }, {
    day: 'V',
    pct: 1
  }, {
    day: 'S',
    pct: 0.66
  }, {
    day: 'D',
    pct: 0
  }];
  const totalDays = 132;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);
  const avgPct = Math.round(week.reduce((a, d) => a + d.pct, 0) / week.length * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) var(--space-5) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-text-primary)'
    }
  }, "Tu progreso"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--color-text-secondary)',
      marginTop: 2
    }
  }, "As\xED te ha ido \xFAltimamente.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-2) 0 var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: range,
    onChange: setRange,
    tabs: [{
      value: 'week',
      label: 'Semana'
    }, {
      value: 'month',
      label: 'Mes'
    }, {
      value: 'year',
      label: 'Año'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-brand)',
      fontFamily: 'var(--font-display)'
    }
  }, avgPct, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, "Cumplimiento")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--amber-600)',
      fontFamily: 'var(--font-display)'
    }
  }, bestStreak), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, "Mejor racha")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display-sm)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-display)'
    }
  }, totalDays), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 4
    }
  }, "D\xEDas totales"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, "Esta semana"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'flex-end',
      gap: 'var(--space-3)',
      height: 140
    }
  }, week.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      height: '100%',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 22,
      borderRadius: 'var(--radius-pill)',
      height: `${Math.max(d.pct, 0.06) * 76}px`,
      background: d.pct >= 1 ? 'var(--color-brand)' : d.pct > 0 ? 'var(--green-300)' : 'var(--sand-200)',
      transition: 'height var(--duration-slow) var(--ease-standard)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label-sm)',
      color: 'var(--color-text-tertiary)'
    }
  }, d.day)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      font: 'var(--text-label-md)',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, "Por h\xE1bito"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, habits.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    style: {
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(ProgressRing, {
    progress: Math.min(h.streak / 30, 1),
    size: 44,
    strokeWidth: 5
  }, h.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title-sm)',
      color: 'var(--color-text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, h.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--color-text-tertiary)',
      marginTop: 2
    }
  }, h.category)), /*#__PURE__*/React.createElement(StreakBadge, {
    days: h.streak,
    size: "sm"
  }))))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/StatsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coachpal-app/TabBar.jsx
try { (() => {
function TabBar({
  active,
  onChange
}) {
  const items = [{
    key: 'home',
    label: 'Hoy',
    icon: '⌂'
  }, {
    key: 'stats',
    label: 'Progreso',
    icon: '◔'
  }, {
    key: 'profile',
    label: 'Perfil',
    icon: '○'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--tabbar-height)',
      display: 'flex',
      background: 'rgba(253,251,247,0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--color-border-subtle)'
    }
  }, items.map(it => {
    const isActive = it.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onChange(it.key),
      style: {
        flex: 1,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        color: isActive ? 'var(--color-brand)' : 'var(--color-text-tertiary)',
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, it.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-label-sm)'
      }
    }, it.label));
  }));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coachpal-app/TabBar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.DayMoodRing = __ds_scope.DayMoodRing;

__ds_ns.HabitCard = __ds_scope.HabitCard;

__ds_ns.HabitCheckButton = __ds_scope.HabitCheckButton;

__ds_ns.HabitRow = __ds_scope.HabitRow;

__ds_ns.IdentityVoteBar = __ds_scope.IdentityVoteBar;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.StreakBadge = __ds_scope.StreakBadge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
