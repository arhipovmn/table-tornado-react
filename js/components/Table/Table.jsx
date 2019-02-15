import React from 'react';

import PreLoader from '../PreLoader/PreLoader.jsx';
import Paginator from '../Paginator/Paginator.jsx';
import Row from './container/row';

import style from './Table.less';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        props.getData(this.props.match.params.hasOwnProperty('key') ? +this.props.match.params.key : 1);
    };

    render() {
        const countPage = this.props.table.list.length ? this.props.table.list[(this.props.table.list.length - 1)].countPage : 1;

        return <PreLoader fetching={this.props.table.fetching}>
            <div className={style['center']}>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={this.props.getData}/>
            </div>
            <div className={style['center']}>
                <div className={style['table']}>
                    <div className={style['th']}>
                        <div className={style['td']}>
                            <div>#</div>
                        </div>
                        <div className={style['td']}>
                            <div>Детали заказ</div>
                        </div>
                        <div className={style['td']}>
                            <div>Детали исполнения</div>
                        </div>
                    </div>
                    {this.props.table.list.map((row, key) => {
                        if (row.hasOwnProperty('countPage')) return null;
                        return <Row key={key} row={row}
                                    keyStore={key}
                                    currentPage={this.props.table.currentPage}/>
                    })}
                </div>
            </div>
            <div className={style['center']}>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={this.props.getData}/>
            </div>
        </PreLoader>;
    };
}