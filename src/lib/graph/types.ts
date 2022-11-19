export interface Position {
    x: number,
    y: number,
}

export interface LinePosition {
    p1: Position,
    p2: Position,
}

export interface Size {
    width: number,
    height: number,
}

export interface Rectangle {
    pos: Position,
    size: Size,
}

export interface Circle {
    pos: Position,
    radius: number,
}

/** An object with a field named id */
export interface Identifiable {
    id: string;
}

/** An object with a position and a dragable bool */
export interface Dragable {
    pos: Position,
    dragable: boolean,
}

export interface NodeType extends Identifiable, Dragable {
    pos: Position,
    size: number,
    color: string,
    type: string,
    label: string,
}

export interface LineType extends Identifiable {
    start: Position,
    end: Position,
    width: number,
    color: string,
}

export interface LinkType extends Identifiable {
    startNode: NodeType;
    endNode: NodeType;
}

export interface TextBox extends Identifiable, Dragable {
    size: number; // font size
    color: string;
    text: string;
}




export interface ShapeType extends Identifiable, Dragable {
    radius: number;
    color: string;
    type: string;
}