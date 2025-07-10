import ProtectedRoute from '../components/ProtectedRoute';

function Legal() {
  return (
    <div className="p-8">
      <h2 className="text-2xl">Área Legal</h2>
      <p>Contenido legal...</p>
    </div>
  );
}

export default function LegalPage() {
  return (
    <ProtectedRoute roles={["legal"]}>
      <Legal />
    </ProtectedRoute>
  );
}