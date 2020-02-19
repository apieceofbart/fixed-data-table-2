/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableContainer
 * @typechecks
 * @noflow
 */

import * as ActionTypes from 'ActionTypes';
import FixedDataTable from 'FixedDataTable';
import FixedDataTableStore from 'FixedDataTableStore';
import React from 'react';
import { bindActionCreators } from 'redux';
import * as columnActions from 'columnActions';
import invariant from 'invariant';
import pick from 'lodash/pick';
import * as scrollActions from 'scrollActions';

class FixedDataTableContainer extends React.Component {
  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.reduxStore = FixedDataTableStore.get();

    this.scrollActions = bindActionCreators(scrollActions, this.reduxStore.dispatch);
    this.columnActions = bindActionCreators(columnActions, this.reduxStore.dispatch);

    this.reduxStore.dispatch({
      type: ActionTypes.INITIALIZE,
      props,
    });

    this.unsubscribe = this.reduxStore.subscribe(this.update);
    this.state = this.getBoundState();
  }

  componentDidUpdate(prevProps) {
    // Only react to prop changes - ignore updates due to internal state
    if (this.props === prevProps) {
      return;
    }

    invariant(
      this.props.height !== undefined || this.props.maxHeight !== undefined,
      'You must set either a height or a maxHeight'
    );

    this.reduxStore.dispatch({
      type: ActionTypes.PROP_CHANGE,
      newProps: this.props,
      oldProps: prevProps,
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.reduxStore = null;
  }

  render() {
    return (
      <FixedDataTable
        {...this.state}
        {...this.props}
        scrollActions={this.scrollActions}
        columnActions={this.columnActions}
      />
    );
  }

  getBoundState() {
    const state = this.reduxStore.getState();
    const boundState = pick(state, [
      'columnGroupProps',
      'columnProps',
      'columnReorderingData',
      'columnResizingData',
      'elementHeights',
      'elementTemplates',
      'firstRowIndex',
      'endRowIndex',
      'isColumnReordering',
      'isColumnResizing',
      'maxScrollX',
      'maxScrollY',
      'rows',
      'rowOffsets',
      'rowSettings',
      'scrollContentHeight',
      'scrollFlags',
      'scrollX',
      'scrollY',
      'scrolling',
      'scrollJumpedX',
      'scrollJumpedY',
      'tableSize',
    ]);
    return boundState;
  }

  update() {
    this.setState(this.getBoundState());
  }
}

export default FixedDataTableContainer;
