import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import "./group_move.css";

export interface GroupMoveItem {
    id: string;
    label: string;
    description?: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    detail?: ReactNode;
    dragPreview?: { icon?: ReactNode; label?: string };
    disabled?: boolean;
}
export interface GroupMoveGroup { id: string; label: string; items: GroupMoveItem[]; eyebrow?: string; disabled?: boolean; emptyText?: string }
export interface GroupMoveEvent { itemId: string; fromGroupId: string; toGroupId: string }
export interface GroupMoveProps {
    groups: GroupMoveGroup[];
    onMove: (event: GroupMoveEvent) => void;
    canMove?: (event: GroupMoveEvent) => boolean;
    label?: string;
    disabled?: boolean;
}

/** Controlled: the consumer confirms a move by updating groups. IDs must be unique. */
export function GroupMove({ groups, onMove, canMove, label = "Mover elementos entre grupos", disabled = false }: GroupMoveProps): React.ReactNode {
    const [selected, setSelected] = useState<GroupMoveEvent | null>(null);
    const [dragged, setDragged] = useState<GroupMoveEvent | null>(null);
    const [over, setOver] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const [arrived, setArrived] = useState<string | null>(null);
    const pending = useRef<{ move: GroupMoveEvent; item: string; destination: string; focus: boolean } | null>(null);
    const buttons = useRef(new Map<string, HTMLButtonElement>());
    const previews = useRef(new Map<string, HTMLSpanElement>());
    const selectedItem = selected && groups.find((group) => group.id === selected.fromGroupId)?.items.find((item) => item.id === selected.itemId && !item.disabled);
    const activeSelection = !disabled && selectedItem ? selected : null;

    useEffect(() => {
        const request = pending.current;
        if (!request) return;
        if (groups.find((group) => group.id === request.move.toGroupId)?.items.some((item) => item.id === request.move.itemId)) {
            setAnnouncement(`${request.item} movido a ${request.destination}.`);
            setArrived(request.move.itemId);
            if (request.focus) buttons.current.get(request.move.itemId)?.focus();
            pending.current = null;
        }
    }, [groups]);

    useEffect(() => {
        if (!arrived) return;
        const timer = window.setTimeout(() => setArrived(null), 300);
        return () => window.clearTimeout(timer);
    }, [arrived]);

    function allowed(move: GroupMoveEvent, group: GroupMoveGroup): boolean {
        return !disabled && !group.disabled && move.fromGroupId !== group.id && (canMove?.({ ...move, toGroupId: group.id }) ?? true);
    }
    function moveTo(move: GroupMoveEvent, group: GroupMoveGroup, focus: boolean) {
        const source = groups.find((entry) => entry.id === move.fromGroupId);
        const item = source?.items.find((entry) => entry.id === move.itemId);
        if (!item || item.disabled || !allowed(move, group)) return;
        const next = { ...move, toGroupId: group.id };
        pending.current = { move: next, item: item.label, destination: group.label, focus };
        setAnnouncement("");
        setSelected(null);
        setDragged(null);
        setOver(null);
        onMove(next);
    }
    return <div className="bui-group-move" role="group" aria-label={label} onKeyDown={(event) => {
        if (event.key === "Escape" && activeSelection) {
            buttons.current.get(activeSelection.itemId)?.focus();
            setSelected(null);
            setAnnouncement("Selección cancelada.");
        }
    }}>
        <p className="bui-group-move-help">Arrastra un elemento o selecciónalo y elige un destino. Escape cancela la selección.</p>
        <div className="bui-group-move-status" role="status" aria-live="polite">{announcement || (activeSelection ? `${selectedItem?.label} seleccionado. Elige un destino.` : "")}</div>
        {typeof document !== "undefined" && createPortal(groups.flatMap((group) => group.items.map((item) => (
            <span key={item.id} ref={(node) => { if (node) previews.current.set(item.id, node); else previews.current.delete(item.id); }} className="bui-group-move-preview" aria-hidden="true">
                <span className="bui-group-move-preview-card">
                    <span className="bui-group-move-preview-icon">{item.dragPreview?.icon ?? item.icon ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}</span>
                    <span className="bui-group-move-preview-label">{item.dragPreview?.label ?? item.label}</span>
                </span>
            </span>
        ))), document.body)}
        <div className="bui-group-move-grid">{groups.map((group, index) => <section key={group.id} className={`bui-group-move-group${index === 0 ? " is-first" : ""}${over === group.id ? " is-over" : ""}`} style={index === 0 ? { gridRow: `1 / span ${Math.max(1, groups.length - 1)}` } : undefined} aria-label={group.label}
            onDragOver={(event) => { if (dragged && allowed(dragged, group)) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setOver(group.id); } }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null); }}
            onDrop={(event) => { event.preventDefault(); if (dragged) moveTo(dragged, group, false); setOver(null); }}>
            <div className="bui-group-move-heading"><div>{group.eyebrow && <span className="bui-group-move-eyebrow">{group.eyebrow}</span>}<h3>{group.label}</h3></div><span className="bui-group-move-count">{group.items.length} {group.items.length === 1 ? "elemento" : "elementos"}</span></div>
            {activeSelection && allowed(activeSelection, group) && <button className="bui-group-move-place" type="button" onClick={(event) => moveTo(activeSelection, group, event.detail === 0)}>Colocar aquí <span className="sr-only">en {group.label}</span></button>}
            {group.items.length ? <ul>{group.items.map((item) => <li key={item.id}><button type="button" ref={(node) => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }}
                className={`bui-group-move-item${activeSelection?.itemId === item.id ? " is-selected" : ""}${dragged?.itemId === item.id ? " is-dragging" : ""}${arrived === item.id ? " is-arriving" : ""}`}
                disabled={disabled || item.disabled} draggable={!disabled && !item.disabled} aria-pressed={activeSelection?.itemId === item.id}
                onClick={() => { pending.current = null; setAnnouncement(""); setSelected(activeSelection?.itemId === item.id ? null : { itemId: item.id, fromGroupId: group.id, toGroupId: group.id }); }}
                onDragStart={(event) => { event.dataTransfer.setData("text/plain", item.id); event.dataTransfer.effectAllowed = "move"; const preview = previews.current.get(item.id); if (preview) event.dataTransfer.setDragImage(preview, 53, 53); setSelected(null); setDragged({ itemId: item.id, fromGroupId: group.id, toGroupId: group.id }); }}
                onDragEnd={() => { setDragged(null); setOver(null); }}>{(item.icon ?? item.badge) != null && <span className="bui-group-move-badge" aria-hidden="true">{item.icon ?? item.badge}</span>}<span className="bui-group-move-copy"><strong>{item.label}</strong>{item.description && <span>{item.description}</span>}</span>{item.detail != null && <span className="bui-group-move-detail">{item.detail}</span>}</button></li>)}</ul> : <p className="bui-group-move-empty">{group.emptyText ?? "Sin elementos."}</p>}
        </section>)}</div>
    </div>;
}
