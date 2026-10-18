/** B13 capture prototype. Not mounted by product UI until renderer admission.
 * Reuses the measured rows/catalog and captures only the fixed inner canvas.
 */
import React from 'react';
import PieceVisualCard from './PieceVisualCard';

export default class PieceExportCanvas extends React.Component {
  getCaptureTarget = () => this.card?.getCaptureTarget() || null;
  render() {
    return React.createElement(PieceVisualCard, { savedRecord: this.props.savedRecord,
      exportCanvas: true, ref: card => { this.card = card; } });
  }
}
