import type { DataSourceInfo } from '../common/data-source-info.js';

export function DataSourceCredentialsForm({
  dataSource,
}: {
  dataSource: DataSourceInfo;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    alert(JSON.stringify(data));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Configure {dataSource.name}</h3>

      {dataSource.description && <p>{dataSource.description}</p>}

      {dataSource.fields.map((field) => (
        <div key={field.name}>
          <label>
            {field.description || field.name}
            {field.isRequired && <span>*</span>}
          </label>
          <input type="text" name={field.name} />
        </div>
      ))}

      <button type="submit">Save</button>
    </form>
  );
}
