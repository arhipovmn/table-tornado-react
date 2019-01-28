import React from 'react';

import style from './Table.less';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
        };
    };

    componentDidMount() {

        fetch('/table', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                mode: 'get',
                page: 1,
            }),
        }).then(responce => {
            responce.json().then(json => {
                if (!Object.keys(json).length) throw 'empty';
                this.setState({list: json})
            }).catch(error => {
                console.error(error);
            });
        }).catch(error => {
            console.error('nor responce');
        });

    }

    render() {
        return <div className={style['table']}>
            <div className={style['th']}>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
                <div className={style['td']}><div>1</div></div>
            </div>
            {this.state.list.map(row => {
                if (row.hasOwnProperty('page')) return null;
                return <div className={style['tr']}>
                    <div className={style['td']}><div>{row.NUMBER}</div></div>
                    <div className={style['td']}><div>{row.BODY}</div></div>
                    <div className={style['td']}><div>{row.WHERE}</div></div>
                    <div className={style['td']}><div>{row.CREATED}</div></div>
                    <div className={style['td']}><div>{row.DATAPAY}</div></div>
                    <div className={style['td']}><div>{row.TRACKNUMBER}</div></div>
                    <div className={style['td']}><div>{row.COMPLETED}</div></div>
                </div>
            })}
        </div>;
    };
}