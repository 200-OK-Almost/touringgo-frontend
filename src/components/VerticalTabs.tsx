import "./VerticalTabs.css"
import React from "react";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: React.ReactNode;
}

export interface VerticalTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  ariaLabel?: string;
}

export function VerticalTabs<T extends string>({ tabs, activeTab, onChange, ariaLabel }: VerticalTabsProps<T>) {
  return (
    <aside className="vertical-tabs-sidebar" aria-label={ariaLabel}>
      <nav className="vertical-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`vertical-tab ${activeTab === tab.id ? "vertical-tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            <span className="vertical-tab__icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}