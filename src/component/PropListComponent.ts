/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "./Component";
import {PropConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";
import {extractIdType} from "../utils/Utils";

export class PropList extends CustomComponent {

    // prop is not a property, it's the prop used in a scene
    private props: State<PropConfig[]>;
    private selected: State<PropConfig>;
    private readonly toggleSelected;
    private readonly isPropEnabled;

    public constructor(props, selected, toggleSelected, isPropEnabled) {
        super()
        this.props = props
        this.selected = selected
        this.toggleSelected = toggleSelected
        this.isPropEnabled = isPropEnabled
        this.mount()
    }

    subscribe() {
        return [".prop__list-container"]
    }

    afterRender() {
        $('.prop__list__item').on("click", (e) => {
            const [id] = extractIdType(e.target.id)
            this.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const selected = this.selected.get()
        return this.props.get().map(prop => {
            return `<div id='prop-list-${prop.propId}' class='pointer prop__list__item  ${selected === prop ? "prop__list__item--selected" : "prop__list__item--not-selected"}'>
                    <i id='prop-list-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    <span id='prop-list-text-${prop.propId}'>${prop.name}</span>
                    </div>`
        })
    }
}