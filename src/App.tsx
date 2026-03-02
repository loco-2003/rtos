/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SystemMonitor from './pages/SystemMonitor';
import ExamClient from './pages/ExamClient';
import ProctoringUnit from './pages/ProctoringUnit';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitor" element={<SystemMonitor />} />
          <Route path="/exam" element={<ExamClient />} />
          <Route path="/proctor" element={<ProctoringUnit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
