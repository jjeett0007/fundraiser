import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
// Types for the contentJson structure

interface NodeData {
  type: string;
  children?: NodeData[];
  text?: string;
  tag?: string;
  listType?: string;
  start?: number;
  checked?: boolean;
  src?: string;
  altText?: string;
  textFormat?: number;
  textStyle?: string;
  language?: string;
  [key: string]: any;
}

interface ContentJson {
  root: NodeData;
}

interface Props {
  contentJson: ContentJson;
}

function renderNode(node: NodeData, key?: React.Key): React.ReactNode {
  switch (node.type) {
    case "heading":
      const Tag = (node.tag as keyof JSX.IntrinsicElements) || "h2";
      return (
        <Tag
          className={`$${
            node.tag === "h1" &&
            "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
          } $${
            node.tag === "h2" &&
            "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
          } $${
            node.tag === "h3" &&
            "scroll-m-20 text-2xl font-semibold tracking-tight"
          }
           $${
             node.tag === "h4" &&
             "scroll-m-20 text-xl font-semibold tracking-tight"
           }
           $${
             node.tag === "h5" &&
             "scroll-m-20 text-lg font-semibold tracking-tight"
           }
           $${
             node.tag === "h6" &&
             "scroll-m-20 text-base font-semibold tracking-tight"
           }
          ${node.textFormat === 2 && "italic"} 
          ${node.textFormat === 1 && "font-bold"} 
          `}
          key={key}
        >
          {node.children?.map(renderNode)}
        </Tag>
      );
    case "paragraph":
      return (
        <p
          className={`${node.textFormat === 8 && "underline"} ${
            node.textFormat === 9 && "font-bold underline"
          } ${node.textFormat === 3 && "font-bold italic"} ${
            node.textFormat === 10 && "underline italic"
          } leading-7 [&:not(:first-child)]:mt-6 text-left`}
          key={key}
        >
          {node.children && node.children.length > 0
            ? node.children.map(renderNode)
            : node.text}
        </p>
      );
    case "list":
      if (node.listType === "number") {
        return (
          <ol
            className="my-6 ml-6 [&>li]:mt-2 list-outside !list-decimal"
            key={key}
            start={node.start || 1}
          >
            {node.children?.map(renderNode)}
          </ol>
        );
      } else if (node.listType === "check") {
        return (
          <ul
            className="m-0 p-0 list-outside relative"
            key={key}
            style={{ listStyle: "none", paddingLeft: 0 }}
          >
            {node.children?.map(renderNode)}
          </ul>
        );
      } else {
        return <ul key={key}>{node.children?.map(renderNode)}</ul>;
      }
    case "listitem":
      if (typeof node.checked === "boolean") {
        return (
          <li key={key}>
            <input type="checkbox" checked={node.checked} readOnly />{" "}
            {node.children?.map(renderNode)}
          </li>
        );
      }
      return (
        <li className="mx-8" key={key}>
          {node.children?.map(renderNode)}
        </li>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 pl-6 italic" key={key}>
          {node.children?.map(renderNode) || node.text}
        </blockquote>
      );
    case "image":
      return (
        <div style={{ display: "flex", justifyContent: "center" }} key={key}>
          <Image
            src={node.src || "/image.png"}
            width={node.width && node.width > 0 ? node.width : 400}
            height={node.height && node.height > 0 ? node.height : 300}
            alt={node.altText || "image"}
            className="relative inline-block user-select-none cursor-default editor-image rounded"
            style={{
              maxWidth: node.maxWidth || 300,
              width: node.width || undefined,
              height: node.height || undefined,
            }}
          />
        </div>
      );
    case "inlineImage":
      return (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              key={key}
              src={node.src || "/image.png"}
              width={node.width && node.width > 0 ? node.width : 400}
              height={node.height && node.height > 0 ? node.height : 300}
              alt={node.altText || "image"}
              className={`relative inline-block user-select-none cursor-default inline-editor-image rounded`}
              style={{
                maxWidth: node.maxWidth || 300,
                width: node.width || undefined,
                height: node.height || undefined,
              }}
            />
          </div>
        </>
      );
    case "code":
      return (
        <pre key={key}>
          <code
            data-language={node.language}
            className={`text-left bg-transparent font-mono block  leading-[1.53] text-[13px] m-0 mt-2 mb-2 overflow-x-auto border border-[#ccc] relative rounded-lg tab-size-[2]`}
            style={{
              position: "relative",
            }}
          >
            <style>
              {`
              .code-line {
                display: block;
                position: relative;
                padding-left: 40px;
                
              }
              .code-line-number {
                border-right: 1px solid white;
                position: absolute;
                left: 0;
                width: 32px;
                text-align: right;
                color: #777;
                user-select: none;
                pointer-events: none;
                font-size: 13px;
                padding-right: 8px;
              }
              `}
            </style>
            {node.children
              ? node.children
                  .reduce<{ lines: NodeData[][] }>(
                    (acc, child) => {
                      if (
                        acc.lines.length === 0 ||
                        child.type === "linebreak"
                      ) {
                        acc.lines.push([]);
                        if (child.type !== "linebreak") {
                          acc.lines[acc.lines.length - 1].push(child);
                        }
                      } else {
                        acc.lines[acc.lines.length - 1].push(child);
                      }
                      return acc;
                    },
                    { lines: [] }
                  )
                  .lines.map((line, idx) => (
                    <span className="code-line" key={idx}>
                      <span className="code-line-number">{idx + 1}</span>
                      {line.map((child, childIdx) =>
                        renderNode(child, childIdx)
                      )}
                    </span>
                  ))
              : null}
          </code>
        </pre>
      );
    case "code-highlight":
      return (
        <span
          key={key}
          className={
            node.highlightType === "punctuation"
              ? "text-[#999]"
              : node.highlightType === "operator"
                ? "text-[#9a6e3a]"
                : node.highlightType === "entity"
                  ? "text-[#9a6e3a]"
                  : node.highlightType === "url"
                    ? "text-[#9a6e3a]"
                    : node.highlightType === "function"
                      ? "text-[#dd4a68]"
                      : node.highlightType === "class"
                        ? "text-[#dd4a68]"
                        : node.highlightType === "class-name"
                          ? "text-[#dd4a68]"
                          : node.highlightType === "variable"
                            ? "text-[#e90]"
                            : node.highlightType === "regex"
                              ? "text-[#e90]"
                              : node.highlightType === "important"
                                ? "text-[#e90]"
                                : node.highlightType === "namespace"
                                  ? "text-[#e90]"
                                  : node.highlightType === "attr"
                                    ? "text-[#07a]"
                                    : node.highlightType === "attr"
                                      ? "text-[#07a]"
                                      : node.highlightType === "keyword"
                                        ? "text-[#07a]"
                                        : node.highlightType === "selector"
                                          ? "text-[#690]"
                                          : node.highlightType === "char"
                                            ? "text-[#690]"
                                            : node.highlightType === "inserted"
                                              ? "text-[#690]"
                                              : node.highlightType === "string"
                                                ? "text-[#690]"
                                                : node.highlightType ===
                                                    "property"
                                                  ? "text-[#905]"
                                                  : node.highlightType ===
                                                      "boolean"
                                                    ? "text-[#905]"
                                                    : node.highlightType ===
                                                        "constant"
                                                      ? "text-[#905]"
                                                      : node.highlightType ===
                                                          "deleted"
                                                        ? "text-[#905]"
                                                        : node.highlightType ===
                                                            "tag"
                                                          ? "text-[#905]"
                                                          : node.highlightType ===
                                                              "symbol"
                                                            ? "text-[#905]"
                                                            : node.highlightType ===
                                                                "number"
                                                              ? "text-[#905]"
                                                              : node.highlightType ===
                                                                  "comment"
                                                                ? "text-[#999]"
                                                                : node.highlightType ===
                                                                    "cdata"
                                                                  ? "text-[#999]"
                                                                  : node.highlightType ===
                                                                      "doctype"
                                                                    ? "text-[#999]"
                                                                    : node.highlightType ===
                                                                        "prolog"
                                                                      ? "text-[#999]"
                                                                      : node.highlightType
                                                                        ? `code-${node.highlightType}`
                                                                        : undefined
          }
        >
          {node.text}
        </span>
      );
    case "linebreak":
      return <br key={key} />;
    case "tab":
      // Render as spaces or a tab character
      return (
        <span key={key} style={{ whiteSpace: "pre" }}>
          {"\t"}
        </span>
      );
    case "horizontalrule":
      return (
        <hr
          className={`p-0.5 border-none my-1 mx-0 cursor-pointer after:content-[""] after:block after:h-0.5 after:bg-muted selected:ring-2 selected:ring-primary selected:ring-offset-2 selected:user-select-none`}
          key={key}
        />
      );
    case "collapsible-container":
      return (
        <details
          key={key}
          open={node.open}
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <summary
            style={{
              padding: "0.25rem",
              paddingLeft: "1rem",
              position: "relative",
              fontWeight: 700,
              outline: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              listStyleType: "disclosure-closed",
              listStylePosition: "inside",
            }}
          >
            <style>{`summary::marker { color: red; }`}</style>
            {node.children?.[0] ? renderNode(node.children[0]) : "Details"}
          </summary>
          <div className="pt-0 pr-1 pb-1 pl-4">
            {node.children?.slice(1).map(renderNode)}
          </div>
        </details>
      );
    case "text":
      return (
        <span key={key} style={parseStyle(node.style)}>
          {applyTextFormat(node.text, node.textFormat)}
        </span>
      );
    case "table":
      return (
        <table
          className="w-fit overflow-scroll border-collapse"
          key={key}
          style={{
            borderCollapse: "collapse",
            borderSpacing: 0,
            overflowY: "scroll",
            overflowX: "scroll",
            tableLayout: "fixed",
            width: "100%",
            margin: "0px 25px 30px 0px",
          }}
        >
          <tbody>{node.children?.map(renderNode)}</tbody>
        </table>
      );
    case "tablerow":
      return <tr key={key}>{node.children?.map(renderNode)}</tr>;
    case "tablecell":
      // If headerState is 2 or 3, treat as header cell
      if (
        node.headerState === 2 ||
        node.headerState === 3 ||
        node.headerState === 1
      ) {
        return (
          <th
            className={`EditorTheme__tableCell bg-[#8888889b] w-24 relative border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"`}
            key={key}
            colSpan={node.colSpan || 1}
            rowSpan={node.rowSpan || 1}
            style={parseStyle(node.backgroundColor)}
          >
            {node.children?.map(renderNode)}
          </th>
        );
      }
      return (
        <td
          className={`w-24 relative border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"`}
          key={key}
          colSpan={node.colSpan || 1}
          rowSpan={node.rowSpan || 1}
          style={parseStyle(node.backgroundColor)}
        >
          {node.children?.map(renderNode)}
        </td>
      );
    case "link":
      if (node.url)
        return (
          <Link
            className="text-blue-600 hover:underline hover:cursor-pointer break-all whitespace-normal word-break-break-word overflow-wrap-break-word"
            href={node.url}
            rel={node.rel || undefined}
            target={node.target || undefined}
            title={node.title || undefined}
            key={key}
          >
            {node.children?.length ? node.children.map(renderNode) : node.text}
          </Link>
        );
      return node.children?.map(renderNode);
    default:
      if (node.children)
        return <div key={key}>{node.children.map(renderNode)}</div>;
      return null;
  }
}

function applyTextFormat(text?: string, format?: number) {
  if (!text) return null;
  let el: React.ReactNode = text;
  // 1: bold, 2: italic, 8: underline, 3: bold+italic, 9: bold+underline, etc.
  if (format) {
    if (format & 1) el = <b>{el}</b>;
    if (format & 2) el = <i>{el}</i>;
    if (format & 8) el = <u>{el}</u>;
  }
  return el;
}

function parseStyle(style?: string): React.CSSProperties {
  if (!style) return {};
  return style.split(";").reduce((acc, rule) => {
    const [prop, value] = rule.split(":");
    if (prop && value) {
      // Convert kebab-case to camelCase for React
      const camelProp = prop
        .trim()
        .replace(/-([a-z])/g, (_, char) =>
          char.toUpperCase()
        ) as keyof React.CSSProperties;
      acc[camelProp] = value.trim() as any;
    }
    return acc;
  }, {} as React.CSSProperties);
}

const ContentJsonInterpreter: React.FC<Props> = ({ contentJson }) => {
  return (
    <div className="bg-primary overflow-hidden p-2">
      {contentJson.root.children?.map(renderNode)}
    </div>
  );
};

export default ContentJsonInterpreter;
